"use client";

import { Group, Title, Text, ActionIcon, Tooltip, Stack } from "@mantine/core";
import { IconRefresh, IconSun, IconMoon } from "@tabler/icons-react";
import { Burger } from "@mantine/core";
import { useTheme } from "../../contexts/ThemeContext";
import FilyLogo from "../FilyLogo";
import useAuthStore from "@/store/useAuthStore";
import { UserMenu } from "../UserMenu";

interface FileHeaderProps {
  opened: boolean;
  toggle: () => void;
  onLogout: () => void;
  onRefresh: () => void;
}

export function FileHeader({
  opened,
  toggle,
  onLogout,
  onRefresh,
}: FileHeaderProps) {
  const { t, colorScheme, toggleColorScheme } = useTheme();
  const username = useAuthStore((state) => state.username) || "User";

  return (
    <Group h="100%" px="md" justify="space-between">
      <Group>
        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
        <Group gap="sm">
          <FilyLogo width={80} height={80} />
          <Stack gap={0}>
            <Title order={3}>Fily</Title>
            <Text size="xs" c="dimmed">
              Organize with a Smile
            </Text>
          </Stack>
        </Group>
      </Group>
      <Group>
        <Tooltip label={t("refresh")} position="bottom">
          <ActionIcon
            variant="light"
            size="lg"
            onClick={onRefresh}
            style={{
              transition: "all 0.2s ease",
            }}
            className="hover-lift"
          >
            <IconRefresh size={18} />
          </ActionIcon>
        </Tooltip>
        <Tooltip
          label={colorScheme === "dark" ? t("light") : t("dark")}
          position="bottom"
        >
          <ActionIcon
            variant="light"
            size="lg"
            onClick={() => toggleColorScheme()}
            style={{
              transition: "all 0.2s ease",
            }}
            className="hover-lift"
          >
            {colorScheme === "dark" ? (
              <IconSun size={18} />
            ) : (
              <IconMoon size={18} />
            )}
          </ActionIcon>
        </Tooltip>

        {/* User Menu Komponente */}
        <UserMenu username={username} onLogout={onLogout} />
      </Group>
    </Group>
  );
}
