import { Badge, Box, Flex, Spinner, Text, useColorModeValue, Input, Collapse } from "@chakra-ui/react";
import { FaCheckCircle } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { Todo } from "./TodoList";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BASE_URL } from "../App";

import { useState } from "react";

const TodoItem = ({ todo, index }: { todo: Todo; index: number }) => {
	const queryClient = useQueryClient();
	const [isExpanded, setIsExpanded] = useState(false);
	const [newSubtask, setNewSubtask] = useState("");

	const { mutate: updateTodo, isPending: isUpdating } = useMutation({
		mutationKey: ["updateTodo"],
		mutationFn: async (updatedData?: any) => {
			if (!updatedData && todo.completed) return alert("Todo is already completed");
			try {
				const res = await fetch(BASE_URL + `/todos/${todo._id}`, {
					method: "PATCH",
					headers: {
						"Content-Type": "application/json",
					},
					body: updatedData ? JSON.stringify(updatedData) : null,
				});
				const data = await res.json();
				if (!res.ok) {
					throw new Error(data.error || "Something went wrong");
				}
				return data;
			} catch (error) {
				console.log(error);
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["todos"] });
		},
	});

	const addSubtask = (e: React.FormEvent) => {
		e.preventDefault();
		if (!newSubtask) return;
		
		const subtasks = todo.subtasks || [];
		const updatedSubtasks = [...subtasks, { id: Date.now().toString(), body: newSubtask, completed: false }];
		
		updateTodo({ subtasks: updatedSubtasks });
		setNewSubtask("");
	};

	const toggleSubtask = (subtaskId: string) => {
		const subtasks = todo.subtasks || [];
		const updatedSubtasks = subtasks.map((s) => s.id === subtaskId ? { ...s, completed: !s.completed } : s);
		updateTodo({ subtasks: updatedSubtasks });
	};

	const { mutate: deleteTodo, isPending: isDeleting } = useMutation({
		mutationKey: ["deleteTodo"],
		mutationFn: async () => {
			try {
				const res = await fetch(BASE_URL + `/todos/${todo._id}`, {
					method: "DELETE",
				});
				const data = await res.json();
				if (!res.ok) {
					throw new Error(data.error || "Something went wrong");
				}
				return data;
			} catch (error) {
				console.log(error);
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["todos"] });
		},
	});

	const cardBg = useColorModeValue(
		"rgba(255, 255, 255, 0.65)",
		"rgba(255, 255, 255, 0.04)"
	);
	const cardBorder = useColorModeValue(
		"rgba(0, 0, 0, 0.06)",
		"rgba(255, 255, 255, 0.06)"
	);
	const completedBorder = "rgba(34, 197, 94, 0.25)";
	const textColor = useColorModeValue("gray.700", "gray.200");
	const completedTextColor = useColorModeValue("gray.400", "gray.500");

	return (
		<Flex
			gap={3}
			alignItems="center"
			className="fade-in-up"
			style={{ animationDelay: `${index * 0.06}s` }}
		>
			<Flex
				flex={1}
				alignItems="center"
				p={4}
				borderRadius="14px"
				bg={cardBg}
				border="1px solid"
				borderColor={todo.completed ? completedBorder : cardBorder}
				backdropFilter="blur(16px)"
				justifyContent="space-between"
				transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
				_hover={{
					bg: useColorModeValue(
						"rgba(255, 255, 255, 0.8)",
						"rgba(255, 255, 255, 0.07)"
					),
					transform: "translateY(-1px)",
					boxShadow: useColorModeValue(
						"0 4px 20px rgba(0, 0, 0, 0.06)",
						"0 4px 20px rgba(0, 0, 0, 0.3)"
					),
				}}
				className={todo.completed ? "todo-completed" : ""}
			>
				<Flex alignItems="center" gap={3} flex={1}>
					<Flex direction="column" gap={1}>
						<Flex alignItems="center" gap={2}>
							<Box
								w="8px"
								h="8px"
								borderRadius="50%"
								bg={
									todo.priority === "High" ? "red.400" :
									todo.priority === "Medium" ? "yellow.400" : "blue.400"
								}
								boxShadow={`0 0 8px ${
									todo.priority === "High" ? "rgba(248, 113, 113, 0.6)" :
									todo.priority === "Medium" ? "rgba(250, 204, 21, 0.6)" : "rgba(96, 165, 250, 0.6)"
								}`}
							/>
							<Text
								color={todo.completed ? completedTextColor : textColor}
								textDecoration={todo.completed ? "line-through" : "none"}
								fontSize="md"
								fontWeight={todo.completed ? "400" : "500"}
								transition="all 0.3s ease"
								opacity={todo.completed ? 0.6 : 1}
							>
								{todo.body}
							</Text>
						</Flex>
						<Flex gap={2}>
							<Badge
								w="fit-content"
								fontSize="10px"
								px={2}
								py={0.5}
								textTransform="capitalize"
								bg={useColorModeValue("gray.200", "gray.700")}
								color={useColorModeValue("gray.600", "gray.300")}
								borderRadius="6px"
							>
								{todo.category || "General"}
							</Badge>
							{todo.dueDate && (
								<Badge
									w="fit-content"
									fontSize="10px"
									px={2}
									py={0.5}
									bg={useColorModeValue("blue.50", "blue.900")}
									color={useColorModeValue("blue.600", "blue.200")}
									borderRadius="6px"
								>
									Due: {todo.dueDate}
								</Badge>
							)}
							{todo.isRecurring && (
								<Badge
									w="fit-content"
									fontSize="10px"
									px={2}
									py={0.5}
									bg={useColorModeValue("purple.50", "purple.900")}
									color={useColorModeValue("purple.600", "purple.200")}
									borderRadius="6px"
								>
									{todo.isRecurring}
								</Badge>
							)}
						</Flex>
					</Flex>
				</Flex>

				<Flex alignItems="center" gap={2} ml={3}>
					{todo.completed ? (
						<Badge
							bg="rgba(34, 197, 94, 0.12)"
							color="green.400"
							borderRadius="999px"
							px={3}
							py={1}
							fontSize="xs"
							fontWeight="600"
						>
							Done
						</Badge>
					) : (
						<Badge
							bg="rgba(245, 158, 11, 0.12)"
							color="orange.300"
							borderRadius="999px"
							px={3}
							py={1}
							fontSize="xs"
							fontWeight="600"
						>
							Pending
						</Badge>
					)}
				</Flex>
			</Flex>

			<Collapse in={isExpanded} animateOpacity>
				<Box p={4} mt={-3} mb={3} ml={4} borderLeft="2px solid" borderColor={useColorModeValue("gray.200", "gray.700")}>
					{todo.subtasks?.map((subtask) => (
						<Flex key={subtask.id} alignItems="center" gap={3} mb={2}>
							<Box
								cursor="pointer"
								color={subtask.completed ? "green.400" : useColorModeValue("gray.400", "gray.500")}
								onClick={() => toggleSubtask(subtask.id)}
							>
								<FaCheckCircle size={14} />
							</Box>
							<Text
								fontSize="sm"
								color={subtask.completed ? completedTextColor : textColor}
								textDecoration={subtask.completed ? "line-through" : "none"}
							>
								{subtask.body}
							</Text>
						</Flex>
					))}
					<form onSubmit={addSubtask}>
						<Input
							mt={2}
							size="sm"
							variant="flushed"
							placeholder="Add a subtask..."
							value={newSubtask}
							onChange={(e) => setNewSubtask(e.target.value)}
						/>
					</form>
				</Box>
			</Collapse>

			<Flex gap={1} alignItems="center">
				<Box
					className="action-btn check-btn"
					cursor="pointer"
					onClick={() => setIsExpanded(!isExpanded)}
					color={useColorModeValue("gray.400", "gray.500")}
					_hover={{ color: "brand.400" }}
					fontSize="xs"
					fontWeight="600"
				>
					{isExpanded ? "Hide" : "Subtasks"}
				</Box>
				<Box
					className="action-btn check-btn"
					cursor="pointer"
					onClick={() => updateTodo(undefined)}
					color={useColorModeValue("gray.400", "gray.500")}
					_hover={{ color: "green.400" }}
				>
					{!isUpdating && <FaCheckCircle size={18} />}
					{isUpdating && <Spinner size="sm" />}
				</Box>
				<Box
					className="action-btn delete-btn"
					cursor="pointer"
					onClick={() => deleteTodo()}
					color={useColorModeValue("gray.400", "gray.500")}
					_hover={{ color: "red.400" }}
				>
					{!isDeleting && <MdDelete size={20} />}
					{isDeleting && <Spinner size="sm" />}
				</Box>
			</Flex>
		</Flex>
	);
};
export default TodoItem;
