# 🚀 TaskFlow — Smart Task Manager

TaskFlow is a premium, full-stack task management application designed to boost productivity. Built with a modern technology stack, it features a highly dynamic and responsive user interface, advanced task tracking, and built-in focus tools.

## ✨ Features

*   **Advanced Task Management:** Create, Read, Update, and Delete tasks with extensive metadata (Priorities, Categories, and Due Dates).
*   **Subtasks & Recurring Tasks:** Break large tasks down into smaller steps and automate daily/weekly recurring tasks.
*   **Kanban Board:** A visual board to manage tasks through different workflow stages.
*   **Focus Mode (Pomodoro):** A built-in 25-minute Pomodoro timer with browser notification support to help you stay in the zone.
*   **Analytics Dashboard:** Visualize your productivity with dynamic charts and completion statistics.
*   **Search & Filtering:** Instantly filter tasks by title, priority, or completion status.
*   **Data Export:** Export your task data to CSV with a single click.
*   **Premium UI/UX:** Stunning glassmorphism design, smooth micro-animations, and full dark/light mode support using Chakra UI.

## 🛠️ Tech Stack

*   **Backend:** Go (Golang), Fiber Framework
*   **Frontend:** React (TypeScript), Vite
*   **Database:** MongoDB Atlas
*   **State Management:** TanStack Query (React Query)
*   **Styling:** Chakra UI & Custom CSS (Glassmorphism)

## 🚦 Local Development Setup

### 1. Prerequisites
Ensure you have the following installed on your local machine:
*   [Go](https://go.dev/doc/install) (1.20+)
*   [Node.js](https://nodejs.org/) (v18+)
*   [MongoDB URI](https://www.mongodb.com/cloud/atlas/register) (A free Atlas cluster)

### 2. Environment Variables
Create a `.env` file in the root directory and add the following variables:
```env
MONGODB_URI=<your_mongodb_connection_string>
PORT=5000
ENV=development
```

### 3. Run the Backend
From the root directory, start the Go server:
```bash
go run main.go
```
*Alternatively, you can use `air` for hot-reloading.*

### 4. Run the Frontend
Open a new terminal, navigate to the `client` folder, install dependencies, and start the development server:
```bash
cd client
npm install
npm run dev
```
Navigate to `http://localhost:5173` in your browser.

## 🌐 Production Deployment

TaskFlow is specially configured to be deployed seamlessly as a single unit. When the `ENV` is set to `production`, the Go Fiber backend automatically serves the built React frontend files.

1. **Build the Frontend:**
   ```bash
   cd client
   npm install
   npm run build
   cd ..
   ```
2. **Build the Backend:**
   ```bash
   go build -o main .
   ```
3. **Run the Production Server:**
   ```bash
   ./main
   ```
   
*Note: This configuration works perfectly natively on platforms like **Render**. Simply set your Render Build Command to `cd client && npm install && npm run build && cd .. && go build -o main .` and your Start Command to `./main`.*

---
*Developed by Utkarsh-Tyagi-16*
