/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Flex, Input, Spinner, useColorModeValue, Select } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { BASE_URL } from "../App";

const TodoForm = () => {
	const [newTodo, setNewTodo] = useState("");
	const [priority, setPriority] = useState("Medium");
	const [category, setCategory] = useState("General");
	const [dueDate, setDueDate] = useState("");
	const [isRecurring, setIsRecurring] = useState("");

	const queryClient = useQueryClient();

	const { mutate: createTodo, isPending: isCreating } = useMutation({
		mutationKey: ["createTodo"],
		mutationFn: async (e: React.FormEvent) => {
			e.preventDefault();
			try {
				const res = await fetch(BASE_URL + `/todos`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ body: newTodo, priority, category, dueDate, isRecurring }),
				});
				const data = await res.json();

				if (!res.ok) {
					throw new Error(data.error || "Something went wrong");
				}

				setNewTodo("");
				setPriority("Medium");
				setCategory("General");
				setDueDate("");
				setIsRecurring("");
				return data;
			} catch (error: any) {
				throw new Error(error);
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["todos"] });
		},
		onError: (error: any) => {
			alert(error.message);
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

	return (
		<form onSubmit={createTodo}>
			<Flex
				gap={3}
				p={4}
				borderRadius="16px"
				bg={cardBg}
				border="1px solid"
				borderColor={cardBorder}
				backdropFilter="blur(16px)"
				mb={8}
				boxShadow={useColorModeValue(
					"0 4px 24px rgba(0, 0, 0, 0.04)",
					"0 4px 24px rgba(0, 0, 0, 0.2)"
				)}
			>
				<Flex direction="column" flex={1} gap={2}>
					<Input
						type="text"
						value={newTodo}
						onChange={(e) => setNewTodo(e.target.value)}
						ref={(input) => input && input.focus()}
						placeholder="✍️ What needs to be done?"
						size="lg"
						variant="glass"
						fontSize="md"
						fontWeight="400"
						_placeholder={{
							color: useColorModeValue("gray.400", "gray.500"),
							fontWeight: "400",
						}}
					/>
					<Flex gap={2}>
						<Select
							value={priority}
							onChange={(e) => setPriority(e.target.value)}
							size="sm"
							variant="filled"
							bg={useColorModeValue("rgba(255,255,255,0.5)", "rgba(0,0,0,0.2)")}
							borderRadius="8px"
							w="120px"
							color={useColorModeValue("gray.600", "gray.300")}
						>
							<option value="High">High</option>
							<option value="Medium">Medium</option>
							<option value="Low">Low</option>
						</Select>
						<Select
							value={category}
							onChange={(e) => setCategory(e.target.value)}
							size="sm"
							variant="filled"
							bg={useColorModeValue("rgba(255,255,255,0.5)", "rgba(0,0,0,0.2)")}
							borderRadius="8px"
							w="120px"
							color={useColorModeValue("gray.600", "gray.300")}
						>
							<option value="Work">Work</option>
							<option value="Personal">Personal</option>
							<option value="Health">Health</option>
							<option value="General">General</option>
						</Select>
						<Input
							type="date"
							value={dueDate}
							onChange={(e) => setDueDate(e.target.value)}
							size="sm"
							variant="filled"
							bg={useColorModeValue("rgba(255,255,255,0.5)", "rgba(0,0,0,0.2)")}
							borderRadius="8px"
							w="140px"
							color={useColorModeValue("gray.600", "gray.300")}
						/>
						<Select
							value={isRecurring}
							onChange={(e) => setIsRecurring(e.target.value)}
							size="sm"
							variant="filled"
							bg={useColorModeValue("rgba(255,255,255,0.5)", "rgba(0,0,0,0.2)")}
							borderRadius="8px"
							w="120px"
							color={useColorModeValue("gray.600", "gray.300")}
						>
							<option value="">No Repeat</option>
							<option value="daily">Daily</option>
							<option value="weekly">Weekly</option>
						</Select>
					</Flex>
				</Flex>
				<Button
					type="submit"
					size="lg"
					bg="linear-gradient(135deg, #8b5cf6, #7c3aed)"
					color="white"
					borderRadius="12px"
					px={5}
					minW="52px"
					className="glow-btn"
					_hover={{
						bg: "linear-gradient(135deg, #7c3aed, #6d28d9)",
						transform: "translateY(-1px)",
						boxShadow: "0 4px 20px rgba(139, 92, 246, 0.4)",
					}}
					_active={{
						transform: "scale(0.95)",
					}}
				>
					{isCreating ? <Spinner size="sm" /> : <IoMdAdd size={24} />}
				</Button>
			</Flex>
		</form>
	);
};
export default TodoForm;
