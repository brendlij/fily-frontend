"use client";

import { Modal, Stack, TextInput, Group, Button } from "@mantine/core";
import { useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { NewFolderModalProps } from "./types";

export function NewFolderModal({
  opened,
  onClose,
  onCreateFolder,
}: NewFolderModalProps) {
  const { t } = useTheme();
  const [folderName, setFolderName] = useState("");

  const handleCreateFolder = () => {
    if (folderName.trim()) {
      onCreateFolder(folderName);
      setFolderName(""); // Reset after creation
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={() => {
        setFolderName("");
        onClose();
      }}
      title={t("createNewFolderTitle")}
      transitionProps={{
        transition: "slide-up",
        duration: 300,
        timingFunction: "ease-out",
      }}
    >
      <Stack>
        <TextInput
          label={t("folderName")}
          value={folderName}
          onChange={(e) => setFolderName(e.currentTarget.value)}
          placeholder={t("enterFolderName")}
          data-autofocus
        />
        <Group justify="flex-end">
          <Button
            variant="subtle"
            onClick={() => {
              setFolderName("");
              onClose();
            }}
            style={{ transition: "all 0.2s ease" }}
          >
            {t("cancel")}
          </Button>
          <Button
            onClick={handleCreateFolder}
            style={{ transition: "all 0.2s ease" }}
          >
            {t("create")}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
