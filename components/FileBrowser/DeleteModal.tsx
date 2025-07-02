"use client";

import { Modal, Stack, Text, Group, Button } from "@mantine/core";
import { useTheme } from "../../contexts/ThemeContext";
import { DeleteModalProps } from "./types";

export function DeleteModal({
  opened,
  onClose,
  item,
  onDelete,
}: DeleteModalProps) {
  const { t } = useTheme();

  if (!item) return null;

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
          Möchten Sie <strong>"{item.name}"</strong> {t("deleteConfirmation")}
        </Text>
        <Text size="sm" c="dimmed">
          {item.type === "directory"
            ? t("deleteWarningFolder")
            : t("deleteWarningFile")}
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
