import { extendTheme, type ThemeConfig } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

const config: ThemeConfig = {
	initialColorMode: "dark",
	useSystemColorMode: false,
};

const theme = extendTheme({
	config,
	fonts: {
		heading: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`,
		body: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`,
	},
	colors: {
		brand: {
			50: "#f5f3ff",
			100: "#ede9fe",
			200: "#ddd6fe",
			300: "#c4b5fd",
			400: "#a78bfa",
			500: "#8b5cf6",
			600: "#7c3aed",
			700: "#6d28d9",
			800: "#5b21b6",
			900: "#4c1d95",
		},
		accent: {
			50: "#ecfeff",
			100: "#cffafe",
			200: "#a5f3fc",
			300: "#67e8f9",
			400: "#22d3ee",
			500: "#06b6d4",
			600: "#0891b2",
			700: "#0e7490",
			800: "#155e75",
			900: "#164e63",
		},
		dark: {
			bg: "#0f0f17",
			card: "#1a1a2e",
			border: "#2a2a40",
			surface: "#16162a",
		},
		light: {
			bg: "#f8f7ff",
			card: "#ffffff",
			border: "#e8e5f0",
			surface: "#f0eef8",
		},
	},
	styles: {
		global: (props: any) => ({
			body: {
				backgroundColor: mode("light.bg", "dark.bg")(props),
				color: mode("gray.800", "gray.100")(props),
				transition: "background-color 0.3s ease, color 0.3s ease",
			},
		}),
	},
	components: {
		Button: {
			baseStyle: {
				fontWeight: "600",
				borderRadius: "12px",
				transition: "all 0.2s ease",
			},
			variants: {
				primary: (_props: any) => ({
					bg: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
					color: "white",
					_hover: {
						bg: "linear-gradient(135deg, #7c3aed, #6d28d9)",
						transform: "translateY(-1px)",
						boxShadow: "0 4px 20px rgba(139, 92, 246, 0.4)",
					},
					_active: {
						transform: "scale(0.97)",
					},
				}),
				ghost: (props: any) => ({
					_hover: {
						bg: mode("rgba(139, 92, 246, 0.08)", "rgba(139, 92, 246, 0.15)")(props),
					},
				}),
			},
		},
		Input: {
			variants: {
				glass: (props: any) => ({
					field: {
						bg: mode("rgba(255,255,255,0.7)", "rgba(255,255,255,0.05)")(props),
						border: "1px solid",
						borderColor: mode("light.border", "dark.border")(props),
						borderRadius: "12px",
						_focus: {
							borderColor: "brand.500",
							boxShadow: "0 0 0 3px rgba(139, 92, 246, 0.25)",
						},
						_placeholder: {
							color: mode("gray.400", "gray.500")(props),
						},
					},
				}),
			},
			defaultProps: {
				variant: "glass",
			},
		},
		Badge: {
			baseStyle: {
				borderRadius: "999px",
				px: 3,
				py: 1,
				fontSize: "xs",
				fontWeight: "600",
				textTransform: "uppercase",
				letterSpacing: "0.05em",
			},
		},
	},
});

export default theme;
