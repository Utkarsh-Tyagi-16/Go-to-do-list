package main

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"github.com/robfig/cron/v3"
	"bytes"
	"encoding/csv"
	"time"
)

type Subtask struct {
	ID        string `json:"id" bson:"id"`
	Body      string `json:"body" bson:"body"`
	Completed bool   `json:"completed" bson:"completed"`
}

type Todo struct {
	ID          primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
	Completed   bool               `json:"completed"`
	Body        string             `json:"body"`
	Priority    string             `json:"priority" bson:"priority"`
	Category    string             `json:"category" bson:"category"`
	DueDate     string             `json:"dueDate,omitempty" bson:"dueDate,omitempty"`
	IsRecurring string             `json:"isRecurring,omitempty" bson:"isRecurring,omitempty"` // "daily", "weekly", ""
	Subtasks    []Subtask          `json:"subtasks" bson:"subtasks"`
}

var collection *mongo.Collection

func main() {
	fmt.Println("hello world")

	if os.Getenv("ENV") != "production" {
		// Load the .env file if not in production
		err := godotenv.Load(".env")
		if err != nil {
			log.Fatal("Error loading .env file:", err)
		}
	}

	MONGODB_URI := os.Getenv("MONGODB_URI")
	clientOptions := options.Client().ApplyURI(MONGODB_URI)
	client, err := mongo.Connect(context.Background(), clientOptions)

	if err != nil {
		log.Fatal(err)
	}

	defer client.Disconnect(context.Background())

	err = client.Ping(context.Background(), nil)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("Connected to MONGODB ATLAS")

	collection = client.Database("golang_db").Collection("todos")

	app := fiber.New()

	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:5173",
		AllowHeaders: "Origin,Content-Type,Accept",
	}))

	// Setup Cron Job for recurring tasks
	cCron := cron.New()
	cCron.AddFunc("@midnight", func() {
		fmt.Println("Running daily cron job for recurring tasks")
		cursor, err := collection.Find(context.Background(), bson.M{"isRecurring": bson.M{"$ne": ""}})
		if err == nil {
			for cursor.Next(context.Background()) {
				var t Todo
				if err := cursor.Decode(&t); err == nil {
					// Duplicate task
					t.ID = primitive.NilObjectID
					t.Completed = false
					for i := range t.Subtasks {
						t.Subtasks[i].Completed = false
					}
					// If there's a due date, advance it (simplified logic)
					if t.DueDate != "" {
						parsed, err := time.Parse("2006-01-02", t.DueDate)
						if err == nil {
							if t.IsRecurring == "daily" {
								t.DueDate = parsed.AddDate(0, 0, 1).Format("2006-01-02")
							} else if t.IsRecurring == "weekly" {
								t.DueDate = parsed.AddDate(0, 0, 7).Format("2006-01-02")
							}
						}
					}
					collection.InsertOne(context.Background(), t)
				}
			}
		}
	})
	cCron.Start()

	app.Get("/api/todos/export", exportTodos)
	app.Get("/api/todos", getTodos)
	app.Post("/api/todos", createTodo)
	app.Patch("/api/todos/:id", updateTodo)
	app.Delete("/api/todos/:id", deleteTodo)

	port := os.Getenv("PORT")
	if port == "" {
		port = "5000"
	}

	if os.Getenv("ENV") == "production" {
		app.Static("/", "./client/dist")
	}

	log.Fatal(app.Listen("0.0.0.0:" + port))

}

func getTodos(c *fiber.Ctx) error {
	var todos []Todo

	cursor, err := collection.Find(context.Background(), bson.M{})

	if err != nil {
		return err
	}

	defer cursor.Close(context.Background())

	for cursor.Next(context.Background()) {
		var todo Todo
		if err := cursor.Decode(&todo); err != nil {
			return err
		}
		todos = append(todos, todo)
	}

	return c.JSON(todos)
}

func createTodo(c *fiber.Ctx) error {
	todo := new(Todo)
	// {id:0,completed:false,body:""}

	if err := c.BodyParser(todo); err != nil {
		return err
	}

	if todo.Body == "" {
		return c.Status(400).JSON(fiber.Map{"error": "Todo body cannot be empty"})
	}

	if todo.Priority == "" {
		todo.Priority = "Medium"
	}
	if todo.Category == "" {
		todo.Category = "General"
	}

	insertResult, err := collection.InsertOne(context.Background(), todo)
	if err != nil {
		return err
	}

	todo.ID = insertResult.InsertedID.(primitive.ObjectID)

	return c.Status(201).JSON(todo)
}

func updateTodo(c *fiber.Ctx) error {
	id := c.Params("id")
	objectID, err := primitive.ObjectIDFromHex(id)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid todo ID"})
	}

	filter := bson.M{"_id": objectID}
	
	// Try parsing body to see if we are updating fields
	var updateData map[string]interface{}
	if err := c.BodyParser(&updateData); err == nil && len(updateData) > 0 {
		update := bson.M{"$set": updateData}
		_, err = collection.UpdateOne(context.Background(), filter, update)
	} else {
		// Default toggle completion if no body
		var existing Todo
		collection.FindOne(context.Background(), filter).Decode(&existing)
		update := bson.M{"$set": bson.M{"completed": !existing.Completed}}
		_, err = collection.UpdateOne(context.Background(), filter, update)
	}

	if err != nil {
		return err
	}

	return c.Status(200).JSON(fiber.Map{"success": true})
}

func exportTodos(c *fiber.Ctx) error {
	cursor, err := collection.Find(context.Background(), bson.M{})
	if err != nil {
		return err
	}
	defer cursor.Close(context.Background())

	b := &bytes.Buffer{}
	w := csv.NewWriter(b)
	w.Write([]string{"Task", "Priority", "Category", "Status", "Due Date", "Recurring"})

	for cursor.Next(context.Background()) {
		var t Todo
		if err := cursor.Decode(&t); err == nil {
			status := "Pending"
			if t.Completed {
				status = "Completed"
			}
			w.Write([]string{t.Body, t.Priority, t.Category, status, t.DueDate, t.IsRecurring})
		}
	}
	w.Flush()

	c.Set("Content-Type", "text/csv")
	c.Set("Content-Disposition", "attachment;filename=tasks.csv")
	return c.Send(b.Bytes())
}

func deleteTodo(c *fiber.Ctx) error {
	id := c.Params("id")
	objectID, err := primitive.ObjectIDFromHex(id)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid todo ID"})
	}

	filter := bson.M{"_id": objectID}
	_, err = collection.DeleteOne(context.Background(), filter)

	if err != nil {
		return err
	}

	return c.Status(200).JSON(fiber.Map{"success": true})
}
