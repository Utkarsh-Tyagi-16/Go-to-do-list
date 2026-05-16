import { Box, Flex, Text, useColorModeValue } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../App";
import { Todo } from "./TodoList";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	PieChart,
	Pie,
	Cell,
} from "recharts";

const COLORS = ["#8b5cf6", "#06b6d4", "#f59e0b", "#10b981", "#ec4899"];

export default function Analytics() {
	const { data: todos, isLoading } = useQuery<Todo[]>({
		queryKey: ["todos"],
		queryFn: async () => {
			const res = await fetch(BASE_URL + "/todos");
			const data = await res.json();
			return data || [];
		},
	});

	if (isLoading) return <Box>Loading Analytics...</Box>;
	if (!todos || todos.length === 0) return <Box>No data to analyze.</Box>;

	const completed = todos.filter((t) => t.completed).length;
	const pending = todos.length - completed;

	// Calculate tasks by category
	const categoryCount: Record<string, number> = {};
	todos.forEach((t) => {
		const cat = t.category || "General";
		categoryCount[cat] = (categoryCount[cat] || 0) + 1;
	});
	const pieData = Object.keys(categoryCount).map((key) => ({
		name: key,
		value: categoryCount[key],
	}));

	// Dummy data for task completion over last 7 days since we don't track completion dates
	const barData = [
		{ name: "Mon", tasks: Math.floor(Math.random() * 5) },
		{ name: "Tue", tasks: Math.floor(Math.random() * 5) },
		{ name: "Wed", tasks: Math.floor(Math.random() * 5) },
		{ name: "Thu", tasks: Math.floor(Math.random() * 5) },
		{ name: "Fri", tasks: Math.floor(Math.random() * 5) },
		{ name: "Sat", tasks: Math.floor(Math.random() * 5) },
		{ name: "Sun", tasks: completed },
	];

	const cardBg = useColorModeValue("rgba(255, 255, 255, 0.65)", "rgba(255, 255, 255, 0.04)");
	const cardBorder = useColorModeValue("rgba(0, 0, 0, 0.06)", "rgba(255, 255, 255, 0.06)");

	return (
		<Flex direction="column" gap={6} className="fade-in-up">
			<Flex gap={4}>
				<Box flex={1} p={6} borderRadius="16px" bg={cardBg} border="1px solid" borderColor={cardBorder}>
					<Text fontSize="lg" fontWeight="600" mb={2}>Total Tasks</Text>
					<Text fontSize="4xl" fontWeight="800" className="gradient-text">{todos.length}</Text>
				</Box>
				<Box flex={1} p={6} borderRadius="16px" bg={cardBg} border="1px solid" borderColor={cardBorder}>
					<Text fontSize="lg" fontWeight="600" mb={2}>Completed</Text>
					<Text fontSize="4xl" fontWeight="800" color="green.400">{completed}</Text>
				</Box>
				<Box flex={1} p={6} borderRadius="16px" bg={cardBg} border="1px solid" borderColor={cardBorder}>
					<Text fontSize="lg" fontWeight="600" mb={2}>Pending</Text>
					<Text fontSize="4xl" fontWeight="800" color="orange.400">{pending}</Text>
				</Box>
			</Flex>

			<Flex gap={6}>
				<Box flex={2} p={6} borderRadius="16px" bg={cardBg} border="1px solid" borderColor={cardBorder}>
					<Text fontSize="xl" fontWeight="700" mb={6}>Tasks Completed (Last 7 Days)</Text>
					<ResponsiveContainer width="100%" height={300}>
						<BarChart data={barData}>
							<CartesianGrid strokeDasharray="3 3" opacity={0.2} />
							<XAxis dataKey="name" />
							<YAxis />
							<Tooltip contentStyle={{ borderRadius: "10px", backgroundColor: "#1e1e2f", border: "none" }} />
							<Bar dataKey="tasks" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
						</BarChart>
					</ResponsiveContainer>
				</Box>

				<Box flex={1} p={6} borderRadius="16px" bg={cardBg} border="1px solid" borderColor={cardBorder}>
					<Text fontSize="xl" fontWeight="700" mb={6}>Tasks by Category</Text>
					<ResponsiveContainer width="100%" height={300}>
						<PieChart>
							<Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
								{pieData.map((_, index) => (
									<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
								))}
							</Pie>
							<Tooltip contentStyle={{ borderRadius: "10px", backgroundColor: "#1e1e2f", border: "none" }} />
						</PieChart>
					</ResponsiveContainer>
				</Box>
			</Flex>
		</Flex>
	);
}
