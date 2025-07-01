"use client";

import { useState } from "react";
import {
  Modal,
  Group,
  Stack,
  Text,
  Switch,
  ColorSwatch,
  Button,
  Divider,
  Title,
  Card,
  ActionIcon,
  Tooltip,
  Select,
} from "@mantine/core";
import {
  IconMoon,
  IconSun,
  IconSettings,
  IconPalette,
  IconLanguage,
} from "@tabler/icons-react";
import { useTheme, CustomColorScheme } from "@/contexts/ThemeContext";
import { ClientOnly } from "./ClientOnly";

interface SettingsModalProps {
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

export function SettingsModal({ opened, onClose }: SettingsModalProps) {
  const {
    colorScheme,
    customColor,
    language,
    toggleColorScheme,
    setCustomColor,
    setLanguage,
    t,
  } = useTheme();

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Group>
          <IconSettings size={20} />
          <Title order={3}>{t("settingsTitle")}</Title>
        </Group>
      }
      size="md"
      transitionProps={{
        transition: "slide-up",
        duration: 300,
        timingFunction: "ease-out",
      }}
    >
      <Stack gap="lg">
        {/* Theme Toggle */}
        <Card withBorder p="md" className="animate-fade-in">
          <Group justify="space-between" mb="xs">
            <Group>
              {colorScheme === "dark" ? (
                <IconMoon size={18} />
              ) : (
                <IconSun size={18} />
              )}
              <Text fw={500}>{t("theme")}</Text>
            </Group>
            <Switch
              checked={colorScheme === "dark"}
              onChange={toggleColorScheme}
              size="md"
              onLabel="🌙"
              offLabel="☀️"
            />
          </Group>
          <Text size="sm" c="dimmed">
            {language === "de"
              ? "Zwischen hellem und dunklem Modus wechseln"
              : "Switch between light and dark mode"}
          </Text>
        </Card>

        <Divider />

        {/* Color Scheme */}
        <Card withBorder p="md" className="animate-slide-up">
          <Group mb="md">
            <IconPalette size={18} />
            <Text fw={500}>{t("accentColor")}</Text>
          </Group>
          <Text size="sm" c="dimmed" mb="md">
            {language === "de"
              ? "Wählen Sie Ihre bevorzugte Akzentfarbe"
              : "Choose your preferred accent color"}
          </Text>

          <Group gap="xs">
            {colorOptions.map((option) => (
              <Tooltip
                key={option.value}
                label={option.label[language]}
                position="top"
              >
                <ColorSwatch
                  color={option.color}
                  size={32}
                  style={{
                    cursor: "pointer",
                    transform:
                      customColor === option.value ? "scale(1.2)" : "scale(1)",
                    transition: "all 0.2s ease",
                    border:
                      customColor === option.value ? "2px solid #000" : "none",
                  }}
                  onClick={() => setCustomColor(option.value)}
                />
              </Tooltip>
            ))}
          </Group>
        </Card>

        <Divider />

        {/* Language Selection */}
        <Card withBorder p="md" className="animate-slide-up">
          <Group mb="md">
            <IconLanguage size={18} />
            <Text fw={500}>{t("language")}</Text>
          </Group>
          <Text size="sm" c="dimmed" mb="md">
            {language === "de"
              ? "Wählen Sie Ihre bevorzugte Sprache"
              : "Choose your preferred language"}
          </Text>

          <Select
            value={language}
            onChange={(value) => value && setLanguage(value as "de" | "en")}
            data={[
              { value: "de", label: t("german") },
              { value: "en", label: t("english") },
            ]}
            size="sm"
            style={{ maxWidth: 200 }}
          />
        </Card>

        <Divider />

        {/* Info */}
        <Card withBorder p="md" className="animate-fade-in">
          <Text size="sm" c="dimmed" ta="center">
            {t("language") === "de"
              ? "Alle Änderungen werden automatisch gespeichert"
              : "All changes are saved automatically"}
          </Text>
        </Card>

        <Button onClick={onClose} fullWidth>
          {language === "de" ? "Schließen" : "Close"}
        </Button>
      </Stack>
    </Modal>
  );
}

export function SettingsButton() {
  const [opened, setOpened] = useState(false);
  const { t } = useTheme();

  return (
    <ClientOnly>
      <Tooltip label={t("settings")} position="bottom">
        <ActionIcon
          variant="light"
          size="lg"
          onClick={() => setOpened(true)}
          style={{
            transition: "all 0.2s ease",
          }}
          className="hover-lift"
        >
          <IconSettings size={18} />
        </ActionIcon>
      </Tooltip>
      <SettingsModal opened={opened} onClose={() => setOpened(false)} />
    </ClientOnly>
  );
}
