import { Box, Flex, Stack, Text, useColorModeValue, Input, Select } from "@chakra-ui/react";

import TodoItem from "./TodoItem";
import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../App";

export type Subtask = {
	id: string;
	body: string;
	completed: boolean;
};

export type Todo = {
	_id: number;
	body: string;
	completed: boolean;
	priority: string;
	category: string;
	dueDate?: string;
	isRecurring?: string;
	subtasks?: Subtask[];
};

import { useState, useEffect } from "react";

const TodoList = () => {
	const [filter, setFilter] = useState("All");
	const [searchQuery, setSearchQuery] = useState("");
	const [priorityFilter, setPriorityFilter] = useState("All");

	useEffect(() => {
		if ("Notification" in window) {
			Notification.requestPermission();
		}
	}, []);
	const { data: todos, isLoading } = useQuery<Todo[]>({
		queryKey: ["todos"],
		queryFn: async () => {
			try {
				const res = await fetch(BASE_URL + "/todos");
				const data = await res.json();

				if (!res.ok) {
					throw new Error(data.error || "Something went wrong");
				}
				return data || [];
			} catch (error) {
				console.log(error);
			}
		},
	});

	useEffect(() => {
		if (todos && "Notification" in window && Notification.permission === "granted") {
			const today = new Date().toISOString().split("T")[0];
			const dueToday = todos.filter(t => t.dueDate === today && !t.completed);
			if (dueToday.length > 0) {
				new Notification("TaskFlow Reminder", {
					body: `You have ${dueToday.length} task(s) due today!`,
					icon: "/goloang.png"
				});
			}
		}
	}, [todos]);

	const completedCount = todos?.filter((t) => t.completed).length || 0;
	const totalCount = todos?.length || 0;

	const filteredTodos = todos?.filter((t) => {
		if (filter === "Pending" && t.completed) return false;
		if (filter === "Completed" && !t.completed) return false;
		if (priorityFilter !== "All" && t.priority !== priorityFilter) return false;
		if (searchQuery && !t.body.toLowerCase().includes(searchQuery.toLowerCase())) return false;
		return true;
	});

	return (
		<>
			{/* Header with stats */}
			<Flex
				alignItems="center"
				justifyContent="space-between"
				mb={5}
				mt={2}
			>
				<Text
					fontSize={{ base: "2xl", md: "3xl" }}
					fontWeight="800"
					letterSpacing="-0.02em"
					className="gradient-text"
				>
					Today's Tasks
				</Text>

				{!isLoading && totalCount > 0 && (
					<Box className="stats-badge">
						<Text
							color={useColorModeValue("brand.600", "brand.300")}
							fontWeight="600"
							fontSize="sm"
						>
							{completedCount}/{totalCount} done
						</Text>
					</Box>
				)}
			</Flex>

			{/* Progress bar */}
			{!isLoading && totalCount > 0 && (
				<Box
					mb={4}
					h="4px"
					borderRadius="999px"
					bg={useColorModeValue("rgba(0,0,0,0.06)", "rgba(255,255,255,0.06)")}
					overflow="hidden"
				>
					<Box
						h="100%"
						borderRadius="999px"
						bg="linear-gradient(90deg, #8b5cf6, #06b6d4)"
						w={`${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%`}
						transition="width 0.5s cubic-bezier(0.4, 0, 0.2, 1)"
					/>
				</Box>
			)}

			{/* Filter Tabs & Search */}
			{!isLoading && totalCount > 0 && (
				<Flex gap={3} mb={6} flexWrap="wrap" alignItems="center">
					<Flex gap={2} bg={useColorModeValue("rgba(255,255,255,0.5)", "rgba(255,255,255,0.03)")} p={1} borderRadius="12px" w="fit-content" border="1px solid" borderColor={useColorModeValue("light.border", "dark.border")}>
						{["All", "Pending", "Completed"].map((f) => (
							<Box
								key={f}
								px={4}
								py={1.5}
								cursor="pointer"
								borderRadius="8px"
								fontSize="sm"
								fontWeight={filter === f ? "600" : "500"}
								color={filter === f ? "white" : useColorModeValue("gray.600", "gray.400")}
								bg={filter === f ? "brand.500" : "transparent"}
								transition="all 0.2s"
								onClick={() => setFilter(f)}
							>
								{f}
							</Box>
						))}
					</Flex>

					<Input
						placeholder="Search tasks..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						w={{ base: "100%", md: "250px" }}
						bg={useColorModeValue("white", "gray.800")}
						borderRadius="12px"
						border="1px solid"
						borderColor={useColorModeValue("gray.200", "gray.700")}
					/>

					<Select
						value={priorityFilter}
						onChange={(e) => setPriorityFilter(e.target.value)}
						w={{ base: "100%", md: "150px" }}
						bg={useColorModeValue("white", "gray.800")}
						borderRadius="12px"
						border="1px solid"
						borderColor={useColorModeValue("gray.200", "gray.700")}
					>
						<option value="All">All Priorities</option>
						<option value="High">High</option>
						<option value="Medium">Medium</option>
						<option value="Low">Low</option>
					</Select>
				</Flex>
			)}

			{/* Loading skeletons */}
			{isLoading && (
				<Stack gap={3}>
					{[1, 2, 3].map((i) => (
						<Box
							key={i}
							className="skeleton"
							h="60px"
							bg={useColorModeValue(
								"rgba(0, 0, 0, 0.04)",
								"rgba(255, 255, 255, 0.04)"
							)}
							borderRadius="14px"
							style={{ animationDelay: `${i * 0.15}s` }}
						/>
					))}
				</Stack>
			)}

			{/* Empty state */}
			{!isLoading && todos?.length === 0 && (
				<Flex
					direction="column"
					alignItems="center"
					gap={4}
					py={16}
					className="fade-in-up"
				>
					<Text fontSize="56px" className="bounce-slow">
						🎉
					</Text>
					<Text
						fontSize="xl"
						fontWeight="700"
						className="gradient-text"
					>
						All caught up!
					</Text>
					<Text
						fontSize="md"
						color={useColorModeValue("gray.400", "gray.500")}
						textAlign="center"
						maxW="300px"
					>
						You've completed everything. Add a new task to keep the momentum going.
					</Text>
				</Flex>
			)}

			{/* Todo items */}
			<Stack gap={3}>
				{filteredTodos?.map((todo, index) => (
					<TodoItem key={todo._id} todo={todo} index={index} />
				))}
			</Stack>
		</>
	);
};
export default TodoList;
