"use client";

import { Button, Stack, Tooltip } from "@mantine/core";
import { IconFolderPlus, IconHome, IconUpload } from "@tabler/icons-react";
import { useTheme } from "../../contexts/ThemeContext";

interface FileToolbarProps {
  onGoHome: () => void;
  onNewFolder: () => void;
  onUpload: () => void;
}

export function FileToolbar({
  onGoHome,
  onNewFolder,
  onUpload,
}: FileToolbarProps) {
  const { t } = useTheme();

  return (
    <Stack gap="md">
      <Tooltip label={t("toHome")} position="right">
        <Button
          leftSection={<IconHome size={14} />}
          variant="light"
          onClick={onGoHome}
          className="enhanced-button"
          style={{ transition: "all 0.2s ease" }}
        >
          {t("home")}
        </Button>
      </Tooltip>

      <Tooltip label={t("createNewFolder")} position="right">
        <Button
          leftSection={<IconFolderPlus size={14} />}
          onClick={onNewFolder}
          className="enhanced-button"
          style={{ transition: "all 0.2s ease" }}
        >
          {t("newFolder")}
        </Button>
      </Tooltip>

      <Tooltip label={t("uploadFiles")} position="right">
        <Button
          leftSection={<IconUpload size={14} />}
          onClick={onUpload}
          className="enhanced-button"
          style={{ transition: "all 0.2s ease" }}
        >
          {t("uploadFile")}
        </Button>
      </Tooltip>
    </Stack>
  );
}
