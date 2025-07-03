"use client";

import { useState } from "react";
import { Menu, ActionIcon, Avatar, Text } from "@mantine/core";
import { IconLogout, IconSettings, IconUserShield } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/contexts/ThemeContext";
import useAuthStore from "@/store/useAuthStore";
import { SettingsModal } from "./SettingsModal";

interface UserMenuProps {
  username: string;
  onLogout: () => void;
}

export function UserMenu({ username, onLogout }: UserMenuProps) {
  const { t } = useTheme();
  const router = useRouter();
  const [settingsOpened, setSettingsOpened] = useState(false);

  // Initialen aus Username (erste 2 Buchstaben, groß)
  const initials = username
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <>
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

          {/* Settings Option */}
          <Menu.Item
            leftSection={<IconSettings size={16} />}
            onClick={() => {
              setSettingsOpened(true);
            }}
          >
            {t("settings")}
          </Menu.Item>

          {/* Admin Option - nur anzeigen wenn User Admin ist */}
          {useAuthStore.getState().isAdmin && (
            <Menu.Item
              leftSection={<IconUserShield size={16} />}
              onClick={() => {
                router.push("/admin");
              }}
            >
              Admin
            </Menu.Item>
          )}

          <Menu.Divider />

          <Menu.Item
            leftSection={<IconLogout size={16} />}
            color="red"
            onClick={onLogout}
          >
            {t("logout")}
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>

      {/* Settings Modal */}
      <SettingsModal
        opened={settingsOpened}
        onClose={() => setSettingsOpened(false)}
      />
    </>
  );
}
