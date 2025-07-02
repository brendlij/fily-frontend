"use client";

import { createContext, useContext, ReactNode } from "react";
import { translations, TranslationKey } from "../lib/translations";
import type { Language } from "../lib/translations";
import {
  useSettingsStore,
  type CustomColorScheme,
  type MantineColorScheme,
  type SortByType,
  type SortDirType,
} from "../store/useSettingsStore";

interface ThemeContextType {
  colorScheme: MantineColorScheme;
  customColor: CustomColorScheme;
  language: Language;
  sortBy: SortByType;
  sortDir: SortDirType;
  toggleColorScheme: () => void;
  setCustomColor: (color: CustomColorScheme) => void;
  setLanguage: (language: Language) => void;
  setSortBy: (val: SortByType) => void;
  setSortDir: (val: SortDirType) => void;
  t: (key: TranslationKey) => string;
  isHydrated: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Verwende den zustand Store anstelle von lokalen useState-Hooks
  const {
    colorScheme,
    customColor,
    language,
    sortBy,
    sortDir,
    isHydrated,
    toggleColorScheme: storeToggleColorScheme,
    setCustomColor: storeSetCustomColor,
    setLanguage: storeSetLanguage,
    setSortBy: storeSetSortBy,
    setSortDir: storeSetSortDir,
  } = useSettingsStore();

  // Wrapper-Funktionen, um die Store-Funktionen direkt im ThemeContext zu verwenden
  const toggleColorScheme = () => {
    storeToggleColorScheme();
  };

  const setCustomColor = (color: CustomColorScheme) => {
    storeSetCustomColor(color);
  };

  const setLanguage = (newLanguage: Language) => {
    storeSetLanguage(newLanguage);
  };

  const setSortBy = (val: SortByType) => {
    storeSetSortBy(val);
  };

  const setSortDir = (val: SortDirType) => {
    storeSetSortDir(val);
  };

  // Übersetzungsfunktion
  const t = (key: TranslationKey): string => {
    return (
      translations[language as keyof typeof translations]?.[
        key as keyof (typeof translations)[typeof language]
      ] || key
    );
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
        sortBy,
        sortDir,
        setSortBy,
        setSortDir,
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
