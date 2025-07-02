import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Language } from "../lib/translations";

export type CustomColorScheme =
  | "blue"
  | "green"
  | "red"
  | "grape"
  | "orange"
  | "teal"
  | "pink"
  | "cyan";

export type MantineColorScheme = "light" | "dark";
export type SortByType = "name" | "type" | "modified" | "size";
export type SortDirType = "asc" | "desc";

interface SettingsState {
  colorScheme: MantineColorScheme;
  customColor: CustomColorScheme;
  language: Language;
  sortBy: SortByType;
  sortDir: SortDirType;
  isHydrated: boolean;

  // Neu für Fuzzy Search
  fuzzySearchEnabled: boolean;
  setFuzzySearchEnabled: (enabled: boolean) => void;

  toggleColorScheme: () => void;
  setCustomColor: (color: CustomColorScheme) => void;
  setLanguage: (language: Language) => void;
  setSortBy: (sortBy: SortByType) => void;
  setSortDir: (sortDir: SortDirType) => void;
  setHydrated: (state: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      colorScheme: "light",
      customColor: "blue",
      language: "de",
      sortBy: "name",
      sortDir: "asc",
      isHydrated: false,

      // Default: Fuzzy an!
      fuzzySearchEnabled: true,
      setFuzzySearchEnabled: (enabled) => set({ fuzzySearchEnabled: enabled }),

      toggleColorScheme: () =>
        set((state) => ({
          colorScheme: state.colorScheme === "light" ? "dark" : "light",
        })),

      setCustomColor: (color) => set({ customColor: color }),

      setLanguage: (language) => set({ language }),

      setSortBy: (sortBy) => set({ sortBy }),

      setSortDir: (sortDir) => set({ sortDir }),

      setHydrated: (isHydrated) => set({ isHydrated }),
    }),
    {
      name: "fily-settings",
      storage: createJSONStorage(() => localStorage),
      // Migration von alten localStorage-Werten, falls nötig
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHydrated(true);

          // Migriere alte Werte, falls notwendig
          const oldColorScheme = localStorage.getItem("fily-color-scheme");
          const oldCustomColor = localStorage.getItem("fily-custom-color");
          const oldLanguage = localStorage.getItem("fily-language");
          const oldSortBy = localStorage.getItem("fily-sort-by");
          const oldSortDir = localStorage.getItem("fily-sort-dir");

          if (oldColorScheme) {
            state.colorScheme = oldColorScheme as MantineColorScheme;
            localStorage.removeItem("fily-color-scheme");
          }

          if (oldCustomColor) {
            // Migration: Convert old 'purple' to 'grape' if needed
            state.customColor =
              oldCustomColor === "purple"
                ? "grape"
                : (oldCustomColor as CustomColorScheme);
            localStorage.removeItem("fily-custom-color");
          }

          if (oldLanguage) {
            state.language = oldLanguage as Language;
            localStorage.removeItem("fily-language");
          }

          if (oldSortBy) {
            state.sortBy = oldSortBy as SortByType;
            localStorage.removeItem("fily-sort-by");
          }

          if (oldSortDir) {
            state.sortDir = oldSortDir as SortDirType;
            localStorage.removeItem("fily-sort-dir");
          }

          // Fuzzy defaulten, falls beim ersten Laden nicht da
          if (typeof state.fuzzySearchEnabled !== "boolean") {
            state.fuzzySearchEnabled = true;
          }
        }
      },
    }
  )
);
