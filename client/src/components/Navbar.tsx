import { Box, Flex, Button, useColorModeValue, useColorMode, Text, Container } from "@chakra-ui/react";
import { IoMoon } from "react-icons/io5";
import { LuSun } from "react-icons/lu";
import { FiDownload } from "react-icons/fi";
import { BASE_URL } from "../App";

export default function Navbar() {
	const { colorMode, toggleColorMode } = useColorMode();

	return (
		<Box
			position="sticky"
			top={0}
			zIndex={100}
			bg={useColorModeValue(
				"rgba(248, 247, 255, 0.8)",
				"rgba(15, 15, 23, 0.8)"
			)}
			backdropFilter="blur(20px)"
			borderBottom="1px solid"
			borderColor={useColorModeValue("light.border", "dark.border")}
		>
			<Container maxW="720px" px={{ base: 4, md: 6 }}>
				<Flex h="70px" alignItems="center" justifyContent="space-between">
					{/* LEFT: App Brand */}
					<Flex alignItems="center" gap={3}>
						<Box
							w="36px"
							h="36px"
							borderRadius="10px"
							bg="linear-gradient(135deg, #8b5cf6, #06b6d4)"
							display="flex"
							alignItems="center"
							justifyContent="center"
							boxShadow="0 4px 14px rgba(139, 92, 246, 0.3)"
						>
							<Text fontSize="18px" fontWeight="800" color="white" lineHeight="1">
								✦
							</Text>
						</Box>
						<Text
							fontSize={{ base: "xl", md: "2xl" }}
							fontWeight="800"
							letterSpacing="-0.02em"
							className="gradient-text"
						>
							TaskFlow
						</Text>
					</Flex>

					{/* RIGHT: Actions */}
					<Flex gap={2} alignItems="center">
						<Button
							as="a"
							href={BASE_URL + "/todos/export"}
							variant="ghost"
							size="sm"
							leftIcon={<FiDownload />}
							borderRadius="10px"
							color={useColorModeValue("gray.600", "gray.300")}
						>
							Export CSV
						</Button>
						<Button
							onClick={toggleColorMode}
							variant="ghost"
							size="md"
							borderRadius="12px"
							p={2}
							className="theme-toggle"
							color={useColorModeValue("gray.600", "gray.300")}
							aria-label="Toggle color mode"
						>
							{colorMode === "light" ? <IoMoon size={20} /> : <LuSun size={22} />}
						</Button>
					</Flex>
				</Flex>
			</Container>
		</Box>
	);
}
