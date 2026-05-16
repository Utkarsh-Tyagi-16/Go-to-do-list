import { Box, Flex, Text, useColorModeValue, Stack, IconButton, Badge } from "@chakra-ui/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BASE_URL } from "../App";
import { Todo } from "./TodoList";
import { FaArrowRight, FaArrowLeft, FaCheckCircle } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

export default function KanbanBoard() {
	const queryClient = useQueryClient();
	const { data: todos, isLoading } = useQuery<Todo[]>({
		queryKey: ["todos"],
		queryFn: async () => {
			const res = await fetch(BASE_URL + "/todos");
			const data = await res.json();
			return data || [];
		},
	});

	const { mutate: updateTodo } = useMutation({
		mutationKey: ["updateTodoStatus"],
		mutationFn: async ({ id, completed }: { id: string | number; completed: boolean }) => {
			const res = await fetch(BASE_URL + `/todos/${id}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ completed }),
			});
			return res.json();
		},
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ["todos"] }),
	});

	const { mutate: deleteTodo } = useMutation({
		mutationKey: ["deleteTodo"],
		mutationFn: async (id: string | number) => {
			await fetch(BASE_URL + `/todos/${id}`, { method: "DELETE" });
		},
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ["todos"] }),
	});

	const cardBg = useColorModeValue("rgba(255, 255, 255, 0.65)", "rgba(255, 255, 255, 0.04)");
	const cardBorder = useColorModeValue("rgba(0, 0, 0, 0.06)", "rgba(255, 255, 255, 0.06)");

	if (isLoading) return <Box>Loading Board...</Box>;

	const pendingTodos = todos?.filter((t) => !t.completed) || [];
	const completedTodos = todos?.filter((t) => t.completed) || [];

	const renderCard = (t: Todo, isCompleted: boolean) => (
		<Flex
			key={t._id}
			direction="column"
			p={4}
			borderRadius="12px"
			bg={cardBg}
			border="1px solid"
			borderColor={cardBorder}
			backdropFilter="blur(10px)"
			boxShadow="sm"
			gap={3}
			_hover={{ transform: "translateY(-2px)", boxShadow: "md" }}
			transition="all 0.2s"
		>
			<Flex justifyContent="space-between" alignItems="flex-start">
				<Text fontWeight="600" textDecoration={isCompleted ? "line-through" : "none"} opacity={isCompleted ? 0.6 : 1}>
					{t.body}
				</Text>
				<IconButton
					aria-label="Delete"
					icon={<MdDelete />}
					size="xs"
					variant="ghost"
					color="red.400"
					onClick={() => deleteTodo(t._id)}
				/>
			</Flex>
			<Flex gap={2}>
				<Badge size="sm" colorScheme={t.priority === "High" ? "red" : t.priority === "Medium" ? "yellow" : "blue"}>
					{t.priority || "Medium"}
				</Badge>
				<Badge size="sm">{t.category || "General"}</Badge>
			</Flex>
			<Flex justifyContent={isCompleted ? "flex-start" : "flex-end"}>
				{isCompleted ? (
					<IconButton
						aria-label="Move back"
						icon={<FaArrowLeft />}
						size="sm"
						variant="outline"
						onClick={() => updateTodo({ id: t._id, completed: false })}
					/>
				) : (
					<IconButton
						aria-label="Mark done"
						icon={<FaCheckCircle />}
						size="sm"
						colorScheme="green"
						onClick={() => updateTodo({ id: t._id, completed: true })}
					/>
				)}
			</Flex>
		</Flex>
	);

	return (
		<Flex gap={6} h="100%" alignItems="flex-start" className="fade-in-up">
			<Box flex={1} bg={useColorModeValue("gray.50", "whiteAlpha.50")} p={4} borderRadius="16px" minH="500px">
				<Flex alignItems="center" gap={2} mb={4}>
					<Box w={3} h={3} borderRadius="50%" bg="orange.400" />
					<Text fontSize="lg" fontWeight="700">To Do ({pendingTodos.length})</Text>
				</Flex>
				<Stack gap={4}>
					{pendingTodos.map((t) => renderCard(t, false))}
				</Stack>
			</Box>
			<Box flex={1} bg={useColorModeValue("gray.50", "whiteAlpha.50")} p={4} borderRadius="16px" minH="500px">
				<Flex alignItems="center" gap={2} mb={4}>
					<Box w={3} h={3} borderRadius="50%" bg="green.400" />
					<Text fontSize="lg" fontWeight="700">Done ({completedTodos.length})</Text>
				</Flex>
				<Stack gap={4}>
					{completedTodos.map((t) => renderCard(t, true))}
				</Stack>
			</Box>
		</Flex>
	);
}
