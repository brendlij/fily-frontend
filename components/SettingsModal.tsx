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
} from "@mantine/core";
import {
  IconMoon,
  IconSun,
  IconSettings,
  IconPalette,
} from "@tabler/icons-react";
import { useTheme, CustomColorScheme } from "@/contexts/ThemeContext";
import { ClientOnly } from "./ClientOnly";

interface SettingsModalProps {
  opened: boolean;
  onClose: () => void;
}

const colorOptions: {
  value: CustomColorScheme;
  label: string;
  color: string;
}[] = [
  { value: "blue", label: "Blau", color: "#339af0" },
  { value: "green", label: "Grün", color: "#51cf66" },
  { value: "red", label: "Rot", color: "#ff6b6b" },
  { value: "grape", label: "Lila", color: "#cc5de8" },
  { value: "orange", label: "Orange", color: "#ff922b" },
  { value: "teal", label: "Türkis", color: "#20c997" },
  { value: "pink", label: "Rosa", color: "#f06595" },
  { value: "cyan", label: "Cyan", color: "#22b8cf" },
];

export function SettingsModal({ opened, onClose }: SettingsModalProps) {
  const { colorScheme, customColor, toggleColorScheme, setCustomColor } =
    useTheme();

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Group>
          <IconSettings size={20} />
          <Title order={3}>Einstellungen</Title>
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
              <Text fw={500}>Erscheinungsbild</Text>
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
            Zwischen hellem und dunklem Modus wechseln
          </Text>
        </Card>

        <Divider />

        {/* Color Scheme */}
        <Card withBorder p="md" className="animate-slide-up">
          <Group mb="md">
            <IconPalette size={18} />
            <Text fw={500}>Akzentfarbe</Text>
          </Group>
          <Text size="sm" c="dimmed" mb="md">
            Wählen Sie Ihre bevorzugte Akzentfarbe
          </Text>

          <Group gap="xs">
            {colorOptions.map((option) => (
              <Tooltip key={option.value} label={option.label} position="top">
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

        {/* Info */}
        <Card withBorder p="md" className="animate-fade-in">
          <Text size="sm" c="dimmed" ta="center">
            Alle Änderungen werden automatisch gespeichert
          </Text>
        </Card>

        <Button onClick={onClose} fullWidth>
          Schließen
        </Button>
      </Stack>
    </Modal>
  );
}

export function SettingsButton() {
  const [opened, setOpened] = useState(false);

  return (
    <ClientOnly>
      <Tooltip label="Einstellungen" position="bottom">
        <ActionIcon
          variant="subtle"
          size="lg"
          onClick={() => setOpened(true)}
          style={{
            transition: "all 0.2s ease",
          }}
        >
          <IconSettings size={18} />
        </ActionIcon>
      </Tooltip>
      <SettingsModal opened={opened} onClose={() => setOpened(false)} />
    </ClientOnly>
  );
}
