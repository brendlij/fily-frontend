"use client";

import {
  Group,
  Title,
  Text,
  ActionIcon,
  Tooltip,
  Stack,
  Menu,
  Avatar,
} from "@mantine/core";
import {
  IconLogout,
  IconRefresh,
  IconSun,
  IconMoon,
} from "@tabler/icons-react";
import { Burger } from "@mantine/core";
import { useTheme } from "../../contexts/ThemeContext";
import FilyLogo from "../FilyLogo";
import { SettingsButton } from "../SettingsModal";
import { AdminButton } from "../AdminButton";
import useAuthStore from "@/store/useAuthStore";

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

  // Initialen aus Username (erste 2 Buchstaben, groß)
  const initials = username
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

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
        <SettingsButton />
        <AdminButton />

        {/* User Avatar mit Menü */}
        <Menu withArrow position="bottom-end" shadow="md">
          <Menu.Target>
            <ActionIcon
              size={40}
              variant="default"
              radius="xl"
              style={{ cursor: "pointer" }}
            >
              <Avatar
                radius="xl"
                color="gray"
                size={30}
                style={{ lineHeight: 1 }}
              >
                {initials}
              </Avatar>
            </ActionIcon>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Label>{username}</Menu.Label>
            <Menu.Item
              leftSection={<IconLogout size={16} />}
              color="red"
              onClick={onLogout}
            >
              {t("logout")}
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
    </Group>
  );
}
