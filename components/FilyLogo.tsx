import React from "react";
import { useTheme } from "../contexts/ThemeContext";

export default function FilyLogo({
  width = 80,
  height = 80,
}: {
  width?: number;
  height?: number;
}) {
  const { customColor } = useTheme();

  // Farbzuordnung für die verschiedenen Akzentfarben mit allen Farbtönen
  const colorSchemes: Record<
    string,
    {
      primary: string;
      background: string;
      fold: string;
      stripe: string;
      eye: string;
      shine: string;
    }
  > = {
    blue: {
      primary: "#339af0",
      background: "#e7f5ff",
      fold: "#d0ebff",
      stripe: "#a5d8ff",
      eye: "#1864ab",
      shine: "#fff",
    },
    green: {
      primary: "#51cf66",
      background: "#ebfbee",
      fold: "#d3f9d8",
      stripe: "#8ce99a",
      eye: "#2b8a3e",
      shine: "#fff",
    },
    red: {
      primary: "#ff6b6b",
      background: "#fff5f5",
      fold: "#ffe0e1",
      stripe: "#ffa8a8",
      eye: "#c92a2a",
      shine: "#fff",
    },
    grape: {
      primary: "#cc5de8",
      background: "#f8f0fc",
      fold: "#f3d9fa",
      stripe: "#e599f7",
      eye: "#862e9c",
      shine: "#fff",
    },
    orange: {
      primary: "#ff922b",
      background: "#fff4e6",
      fold: "#ffe8cc",
      stripe: "#ffc947",
      eye: "#d9480f",
      shine: "#fff",
    },
    teal: {
      primary: "#20c997",
      background: "#e6fcf5",
      fold: "#c3fae8",
      stripe: "#63e6be",
      eye: "#087f5b",
      shine: "#fff",
    },
    pink: {
      primary: "#f06595",
      background: "#fff0f6",
      fold: "#ffdeeb",
      stripe: "#faa2c1",
      eye: "#a61e4d",
      shine: "#fff",
    },
    cyan: {
      primary: "#22b8cf",
      background: "#e3fafc",
      fold: "#c5f6fa",
      stripe: "#66d9ef",
      eye: "#0c8599",
      shine: "#fff",
    },
  };

  const colors = colorSchemes[customColor] || colorSchemes.grape;

  return (
    <svg
      viewBox="0 0 80 80"
      width={width}
      height={height}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Breiteres File mit abgerundeten Ecken */}
      <path
        d="M32 18
           Q24 18 24 24
           L24 60
           Q24 66 32 66
           L56 66
           Q64 66 64 58
           L64 26
           Q64 18 56 18
           Z"
        fill={colors.background}
        stroke={colors.primary}
        strokeWidth="2"
      />
      {/* Abgeknickte Ecke: Vorderseite */}
      <polygon points="56,18 64,18 64,26" fill={colors.primary} />
      {/* Abgeknickte Ecke: "Innenseite" */}
      <polygon points="56,18 64,26 58,26" fill={colors.fold} />
      {/* Papierlinien */}
      <rect x="36" y="25" width="16" height="1" fill={colors.stripe} />
      <rect x="38" y="29" width="12" height="1" fill={colors.stripe} />
      <rect x="37" y="33" width="14" height="1" fill={colors.stripe} />
      {/* Ultra-cute Augen */}
      <ellipse cx="37" cy="46" rx="3.7" ry="4.5" fill={colors.eye} />
      <ellipse cx="51" cy="46" rx="3.7" ry="4.5" fill={colors.eye} />
      {/* Extra Glanzpunkte */}
      <ellipse
        cx="36.2"
        cy="44.5"
        rx="0.85"
        ry="1.2"
        fill={colors.shine}
        opacity="0.9"
      />
      <ellipse
        cx="50.2"
        cy="44.5"
        rx="0.85"
        ry="1.2"
        fill={colors.shine}
        opacity="0.9"
      />
      <ellipse
        cx="38"
        cy="47.3"
        rx="0.4"
        ry="0.6"
        fill={colors.shine}
        opacity="0.5"
      />
      <ellipse
        cx="52"
        cy="47.3"
        rx="0.4"
        ry="0.6"
        fill={colors.shine}
        opacity="0.5"
      />
      {/* Sehr runder, süßer Smiley-Mund */}
      <path
        d="M39,53 Q44,60 49,53"
        stroke={colors.primary}
        strokeWidth="2.2"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}
