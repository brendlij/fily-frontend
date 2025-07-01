"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { MantineColorScheme } from "@mantine/core";
import { Language, translations, TranslationKey } from "../lib/translations";

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
  language: Language;
  toggleColorScheme: () => void;
  setCustomColor: (color: CustomColorScheme) => void;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey) => string;
  isHydrated: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [colorScheme, setColorScheme] = useState<MantineColorScheme>("light");
  const [customColor, setCustomColorValue] =
    useState<CustomColorScheme>("blue");
  const [language, setLanguageValue] = useState<Language>("de");
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Load saved preferences after hydration
    const savedScheme = localStorage.getItem(
      "fily-color-scheme"
    ) as MantineColorScheme;
    let savedColor = localStorage.getItem("fily-custom-color");
    const savedLanguage = localStorage.getItem("fily-language") as Language;

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
    if (savedLanguage && ["de", "en"].includes(savedLanguage)) {
      setLanguageValue(savedLanguage);
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

  const setLanguage = (newLanguage: Language) => {
    setLanguageValue(newLanguage);
    if (isHydrated) {
      localStorage.setItem("fily-language", newLanguage);
    }
  };

  const t = (key: TranslationKey): string => {
    return translations[language][key];
  };

  return (
    <ThemeContext.Provider
      value={{
        colorScheme,
        customColor,
        language,
        toggleColorScheme,
        setCustomColor,
        setLanguage,
        t,
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
