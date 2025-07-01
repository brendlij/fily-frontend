"use client";

import { MantineProvider, createTheme, MantineTheme } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";

function MantineThemeProvider({ children }: { children: React.ReactNode }) {
  const { colorScheme, customColor, isHydrated } = useTheme();

  const theme = createTheme({
    primaryColor: customColor,
    fontFamily: "var(--font-geist-sans)",
    headings: {
      fontFamily: "var(--font-geist-sans)",
    },
    defaultRadius: "md",
    colors: {
      dark: [
        "#c9c9c9",
        "#b8b8b8",
        "#828282",
        "#696969",
        "#424242",
        "#3b3b3b",
        "#2e2e2e",
        "#242424",
        "#1a1a1a",
        "#0c0c0c",
      ],
    },
    white: "#ffffff",
    black: "#000000",
    components: {
      Button: {
        styles: {
          root: {
            transition: "all 0.2s ease",
            "&:hover": {
              transform: "translateY(-1px)",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            },
          },
        },
      },
      Card: {
        styles: {
          root: {
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: "0 8px 25px rgba(0, 0, 0, 0.12)",
            },
          },
        },
      },
      Modal: {
        styles: {
          inner: {
            "& .mantineModalContent": {
              animation: "slideIn 0.3s ease-out",
            },
          },
        },
      },
      Paper: {
        styles: (theme: MantineTheme) => ({
          root: {
            backgroundColor:
              colorScheme === "dark" ? theme.colors.dark[8] : theme.white,
            color: colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
          },
        }),
      },
      Container: {
        styles: (theme: MantineTheme) => ({
          root: {
            backgroundColor:
              colorScheme === "dark" ? theme.colors.dark[9] : theme.white,
          },
        }),
      },
    },
    other: {
      globalStyles: (theme: MantineTheme) => ({
        "@keyframes slideIn": {
          "0%": {
            opacity: 0,
            transform: "translateY(-20px) scale(0.95)",
          },
          "100%": {
            opacity: 1,
            transform: "translateY(0) scale(1)",
          },
        },
        "@keyframes fadeIn": {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        "@keyframes slideUp": {
          "0%": {
            opacity: 0,
            transform: "translateY(20px)",
          },
          "100%": {
            opacity: 1,
            transform: "translateY(0)",
          },
        },
        ".animate-fade-in": {
          animation: "fadeIn 0.5s ease-out",
        },
        ".animate-slide-up": {
          animation: "slideUp 0.6s ease-out",
        },
      }),
    },
  });

  // Use light theme as fallback during SSR to prevent hydration mismatch
  const forceColorScheme = !isHydrated
    ? "light"
    : colorScheme === "auto"
    ? "light"
    : colorScheme;

  return (
    <MantineProvider theme={theme} forceColorScheme={forceColorScheme}>
      <Notifications position="top-right" autoClose={4000} />
      {children}
    </MantineProvider>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <MantineThemeProvider>{children}</MantineThemeProvider>
    </ThemeProvider>
  );
}
