"use client";

import { Modal, Stack, TextInput, Group, Button } from "@mantine/core";
import { useState, useEffect } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { RenameModalProps } from "./types";

export function RenameModal({
  opened,
  onClose,
  initialName,
  onRename,
}: RenameModalProps) {
  const { t } = useTheme();
  const [newName, setNewName] = useState(initialName);

  useEffect(() => {
    if (opened) {
      setNewName(initialName);
    }
  }, [opened, initialName]);

  const handleRename = () => {
    if (newName.trim()) {
      onRename(newName);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={t("renameTitle")}
      transitionProps={{
        transition: "slide-up",
        duration: 300,
        timingFunction: "ease-out",
      }}
    >
      <Stack>
        <TextInput
          label={t("newName")}
          value={newName}
          onChange={(e) => setNewName(e.currentTarget.value)}
          placeholder={t("enterNewName")}
          data-autofocus
        />
        <Group justify="flex-end">
          <Button
            variant="subtle"
            onClick={onClose}
            style={{ transition: "all 0.2s ease" }}
          >
            {t("cancel")}
          </Button>
          <Button
            onClick={handleRename}
            style={{ transition: "all 0.2s ease" }}
          >
            {t("rename")}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
