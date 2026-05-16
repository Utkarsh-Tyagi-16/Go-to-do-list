import { Container, Stack, Box, Flex, useColorModeValue } from "@chakra-ui/react";
import Navbar from "./components/Navbar";
import TodoForm from "./components/TodoForm";
import TodoList from "./components/TodoList";
import KanbanBoard from "./components/KanbanBoard";
import Analytics from "./components/Analytics";
import PomodoroTimer from "./components/PomodoroTimer";
import { useState } from "react";

export const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5000/api" : "/api";

function App() {
	const [view, setView] = useState<"list" | "board" | "analytics" | "focus">("list");
	
	const tabBg = useColorModeValue("rgba(255,255,255,0.5)", "rgba(255,255,255,0.03)");
	const tabBorder = useColorModeValue("light.border", "dark.border");

	return (
		<Box minH="100vh" position="relative">
			{/* Animated background orbs */}
			<div className="animated-bg" />

			<Stack spacing={0} position="relative" zIndex={1}>
				<Navbar />
				<Container maxW={view === "list" ? "720px" : "1000px"} px={{ base: 4, md: 6 }} py={6} transition="all 0.3s">
					<Flex gap={2} mb={8} bg={tabBg} p={1} borderRadius="12px" w="fit-content" border="1px solid" borderColor={tabBorder} mx="auto" flexWrap="wrap" justifyContent="center">
						{(["list", "board", "analytics", "focus"] as const).map((v) => (
							<Box
								key={v}
								px={6}
								py={2}
								cursor="pointer"
								borderRadius="8px"
								fontSize="sm"
								textTransform="capitalize"
								fontWeight={view === v ? "600" : "500"}
								color={view === v ? "white" : useColorModeValue("gray.600", "gray.400")}
								bg={view === v ? "brand.500" : "transparent"}
								transition="all 0.2s"
								onClick={() => setView(v)}
							>
								{v}
							</Box>
						))}
					</Flex>

					{view !== "analytics" && view !== "focus" && <TodoForm />}
					
					{view === "list" && <TodoList />}
					{view === "board" && <KanbanBoard />}
					{view === "analytics" && <Analytics />}
					{view === "focus" && <PomodoroTimer />}
				</Container>
			</Stack>
		</Box>
	);
}

export default App;
