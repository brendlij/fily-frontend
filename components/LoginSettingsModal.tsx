"use client";

import {
  Modal,
  Stack,
  Group,
  Switch,
  Select,
  ColorSwatch,
  Text,
  Tooltip,
  Card,
  Divider,
} from "@mantine/core";
import {
  IconMoon,
  IconSun,
  IconLanguage,
  IconPalette,
} from "@tabler/icons-react";
import { useTheme, CustomColorScheme } from "@/contexts/ThemeContext";

interface LoginSettingsModalProps {
  opened: boolean;
  onClose: () => void;
}

const colorOptions: {
  value: CustomColorScheme;
  label: { de: string; en: string };
  color: string;
}[] = [
  { value: "blue", label: { de: "Blau", en: "Blue" }, color: "#339af0" },
  { value: "green", label: { de: "Grün", en: "Green" }, color: "#51cf66" },
  { value: "red", label: { de: "Rot", en: "Red" }, color: "#ff6b6b" },
  { value: "grape", label: { de: "Lila", en: "Purple" }, color: "#cc5de8" },
  { value: "orange", label: { de: "Orange", en: "Orange" }, color: "#ff922b" },
  { value: "teal", label: { de: "Türkis", en: "Teal" }, color: "#20c997" },
  { value: "pink", label: { de: "Rosa", en: "Pink" }, color: "#f06595" },
  { value: "cyan", label: { de: "Cyan", en: "Cyan" }, color: "#22b8cf" },
];

export function LoginSettingsModal({ opened, onClose }: LoginSettingsModalProps) {
  const {
    colorScheme,
    customColor,
    language,
    toggleColorScheme,
    setCustomColor,
    setLanguage,
  } = useTheme();

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={language === "de" ? "Einstellungen" : "Settings"}
      centered
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}
      size="sm"
    >
      <Stack gap="md">
        {/* Theme Toggle */}
        <Group justify="space-between">
          <Group gap="xs">
            {colorScheme === "dark" ? <IconMoon size={16} /> : <IconSun size={16} />}
            <Text size="sm">
              {language === "de" ? "Dunkles Design" : "Dark Mode"}
            </Text>
          </Group>
          <Switch
            checked={colorScheme === "dark"}
            onChange={toggleColorScheme}
            size="sm"
          />
        </Group>

        <Divider />

        {/* Language Selection */}
        <Group justify="space-between">
          <Group gap="xs">
            <IconLanguage size={16} />
            <Text size="sm">
              {language === "de" ? "Sprache" : "Language"}
            </Text>
          </Group>
          <Select
            data={[
              { value: "de", label: "Deutsch" },
              { value: "en", label: "English" },
            ]}
            value={language}
            onChange={(value) => setLanguage(value as "de" | "en")}
            size="xs"
            w={100}
          />
        </Group>

        <Divider />

        {/* Color Selection */}
        <Stack gap="xs">
          <Group gap="xs">
            <IconPalette size={16} />
            <Text size="sm">
              {language === "de" ? "Akzentfarbe" : "Accent Color"}
            </Text>
          </Group>
          <Group gap="xs">
            {colorOptions.map((option) => (
              <Tooltip
                key={option.value}
                label={option.label[language]}
                position="bottom"
              >
                <ColorSwatch
                  color={option.color}
                  size={28}
                  style={{
                    cursor: "pointer",
                    border:
                      customColor === option.value
                        ? `2px solid ${option.color}`
                        : "2px solid transparent",
                    transform:
                      customColor === option.value ? "scale(1.1)" : "scale(1)",
                    transition: "all 0.2s ease",
                  }}
                  onClick={() => setCustomColor(option.value)}
                />
              </Tooltip>
            ))}
          </Group>
        </Stack>
      </Stack>
    </Modal>
  );
}
