import { Box, Button, Flex, Text, useColorModeValue } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { FaPlay, FaPause, FaRedo } from "react-icons/fa";

const PomodoroTimer = () => {
	const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes
	const [isActive, setIsActive] = useState(false);

	useEffect(() => {
		// Request notification permission if not already granted
		if ("Notification" in window && Notification.permission !== "granted") {
			Notification.requestPermission();
		}
	}, []);

	useEffect(() => {
		let interval: NodeJS.Timeout;
		if (isActive && timeLeft > 0) {
			interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
		} else if (timeLeft === 0) {
			setIsActive(false);
			if ("Notification" in window && Notification.permission === "granted") {
				new Notification("Pomodoro Complete!", {
					body: "Great job! Time for a short break.",
					icon: "/goloang.png"
				});
			}
		}
		return () => clearInterval(interval);
	}, [isActive, timeLeft]);

	const toggleTimer = () => setIsActive(!isActive);
	const resetTimer = () => {
		setIsActive(false);
		setTimeLeft(25 * 60);
	};

	const minutes = Math.floor(timeLeft / 60);
	const seconds = timeLeft % 60;

	return (
		<Flex
			direction="column"
			align="center"
			bg={useColorModeValue("white", "gray.800")}
			p={10}
			borderRadius="24px"
			shadow="2xl"
			border="1px solid"
			borderColor={useColorModeValue("gray.100", "gray.700")}
			maxW="400px"
			mx="auto"
			mt={10}
			className="fade-in-up"
		>
			<Text fontSize="2xl" fontWeight="800" mb={6} className="gradient-text">
				Focus Mode
			</Text>
			
			<Box
				position="relative"
				w="250px"
				h="250px"
				display="flex"
				alignItems="center"
				justifyContent="center"
				borderRadius="50%"
				border="8px solid"
				borderColor={useColorModeValue("brand.100", "rgba(139, 92, 246, 0.2)")}
				mb={8}
				boxShadow={isActive ? `0 0 40px ${useColorModeValue("rgba(139, 92, 246, 0.4)", "rgba(139, 92, 246, 0.6)")}` : "none"}
				transition="all 0.3s ease"
			>
				<Text
					fontSize="7xl"
					fontWeight="900"
					fontFamily="monospace"
					color={useColorModeValue("gray.800", "white")}
				>
					{String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
				</Text>
			</Box>

			<Flex gap={4} w="100%" justifyContent="center">
				<Button
					colorScheme={isActive ? "orange" : "brand"}
					onClick={toggleTimer}
					leftIcon={isActive ? <FaPause /> : <FaPlay />}
					size="lg"
					w="140px"
					borderRadius="12px"
				>
					{isActive ? "Pause" : "Start"}
				</Button>
				<Button
					variant="ghost"
					onClick={resetTimer}
					leftIcon={<FaRedo />}
					size="lg"
					w="140px"
					borderRadius="12px"
				>
					Reset
				</Button>
			</Flex>
		</Flex>
	);
};

export default PomodoroTimer;
