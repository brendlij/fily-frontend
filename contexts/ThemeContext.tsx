"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { MantineColorScheme } from "@mantine/core";

export type CustomColorScheme =
  | "blue"
  | "green"
  | "red"
  | "grape"
  | "orange"
  | "teal"
  | "pink"
  | "cyan";

interface ThemeContextType {
  colorScheme: MantineColorScheme;
  customColor: CustomColorScheme;
  toggleColorScheme: () => void;
  setCustomColor: (color: CustomColorScheme) => void;
  isHydrated: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [colorScheme, setColorScheme] = useState<MantineColorScheme>("light");
  const [customColor, setCustomColorValue] =
    useState<CustomColorScheme>("blue");
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Load saved preferences after hydration
    const savedScheme = localStorage.getItem(
      "fily-color-scheme"
    ) as MantineColorScheme;
    let savedColor = localStorage.getItem("fily-custom-color");

    // Migration: Convert old 'purple' to 'grape'
    if (savedColor === "purple") {
      savedColor = "grape";
      localStorage.setItem("fily-custom-color", "grape");
    }

    if (savedScheme) setColorScheme(savedScheme);
    if (
      savedColor &&
      [
        "blue",
        "green",
        "red",
        "grape",
        "orange",
        "teal",
        "pink",
        "cyan",
      ].includes(savedColor)
    ) {
      setCustomColorValue(savedColor as CustomColorScheme);
    }

    setIsHydrated(true);
  }, []);

  const toggleColorScheme = () => {
    const newScheme: MantineColorScheme =
      colorScheme === "light" ? "dark" : "light";
    setColorScheme(newScheme);
    if (isHydrated) {
      localStorage.setItem("fily-color-scheme", newScheme);
    }
  };

  const setCustomColor = (color: CustomColorScheme) => {
    setCustomColorValue(color);
    if (isHydrated) {
      localStorage.setItem("fily-custom-color", color);
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        colorScheme,
        customColor,
        toggleColorScheme,
        setCustomColor,
        isHydrated,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
