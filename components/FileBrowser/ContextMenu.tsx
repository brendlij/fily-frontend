"use client";

import { Menu } from "@mantine/core";
import { IconDownload, IconEdit, IconTrash } from "@tabler/icons-react";
import { useTheme } from "../../contexts/ThemeContext";
import { ContextMenuType, FileItem } from "./types";

interface ContextMenuProps {
  contextMenu: ContextMenuType | null;
  onDownload: (item: FileItem) => void;
  onRename: (item: FileItem) => void;
  onDelete: (item: FileItem) => void;
  onClose: () => void;
}

export function ContextMenu({
  contextMenu,
  onDownload,
  onRename,
  onDelete,
  onClose,
}: ContextMenuProps) {
  const { t } = useTheme();

  if (!contextMenu) return null;

  return (
    <Menu
      opened
      withArrow
      withinPortal={false}
      closeOnItemClick={false}
      position="bottom" // Required, but will be ignored by styles
      styles={{
        dropdown: {
          position: "fixed",
          top: contextMenu.y,
          left: contextMenu.x,
          transform: "none", // Prevents centering
          zIndex: 1000,
          minWidth: 200,
        },
      }}
    >
      <Menu.Dropdown>
        <Menu.Item
          leftSection={<IconDownload size={14} />}
          onClick={() => {
            if (contextMenu.item) {
              onDownload(contextMenu.item);
              onClose();
            }
          }}
        >
          {contextMenu.item?.type === "directory"
            ? t("downloadAsZip")
            : t("download")}
        </Menu.Item>

        <Menu.Item
          leftSection={<IconEdit size={14} />}
          onClick={() => {
            if (contextMenu.item) {
              onRename(contextMenu.item);
              onClose();
            }
          }}
        >
          {t("rename")}
        </Menu.Item>

        <Menu.Item
          leftSection={<IconTrash size={14} />}
          color="red"
          onClick={() => {
            if (contextMenu.item) {
              onDelete(contextMenu.item);
              onClose();
            }
          }}
        >
          {t("delete")}
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
