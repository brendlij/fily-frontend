"use client";

import { Modal, Stack, Text, Group, Button } from "@mantine/core";
import { useTheme } from "../contexts/ThemeContext";

interface User {
  id: number;
  username: string;
  isAdmin: boolean;
}

interface UserDeleteModalProps {
  opened: boolean;
  onClose: () => void;
  user: User | null;
  onDelete: () => void;
}

export function UserDeleteModal({
  opened,
  onClose,
  user,
  onDelete,
}: UserDeleteModalProps) {
  const { t } = useTheme();

  if (!user) return null;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={t("confirmDelete")}
      transitionProps={{
        transition: "slide-up",
        duration: 300,
        timingFunction: "ease-out",
      }}
    >
      <Stack>
        <Text>
          Möchten Sie den Benutzer <strong>"{user.username}"</strong> wirklich
          löschen?
        </Text>
        <Text size="sm" c="dimmed">
          Diese Aktion kann nicht rückgängig gemacht werden. Der Benutzer
          verliert sofort den Zugang zum System.
        </Text>
        <Group justify="flex-end">
          <Button
            variant="subtle"
            onClick={onClose}
            style={{ transition: "all 0.2s ease" }}
          >
            {t("cancel")}
          </Button>
          <Button
            color="red"
            onClick={onDelete}
            style={{ transition: "all 0.2s ease" }}
          >
            {t("delete")}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
