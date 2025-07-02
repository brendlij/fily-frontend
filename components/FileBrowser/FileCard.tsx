"use client";

import { ActionIcon, Badge, Card, Group, Menu, Text } from "@mantine/core";
import {
  IconDotsVertical,
  IconDownload,
  IconEdit,
  IconFile,
  IconFolder,
  IconTrash,
} from "@tabler/icons-react";
import { useTheme } from "../../contexts/ThemeContext";
import { FileItem } from "./types";

interface FileCardProps {
  item: FileItem;
  onItemClick: (item: FileItem) => void;
  onDownload: (item: FileItem) => void;
  onRename: (item: FileItem) => void;
  onDelete: (item: FileItem) => void;
  onContextMenu: (e: React.MouseEvent, item: FileItem) => void;
  formatFileSize: (bytes: number) => string;
}

export function FileCard({
  item,
  onItemClick,
  onDownload,
  onRename,
  onDelete,
  onContextMenu,
  formatFileSize,
}: FileCardProps) {
  const { t } = useTheme();

  return (
    <Card
      p="md"
      withBorder
      className="hover-lift"
      style={{
        cursor: "pointer",
        transition: "all 0.2s ease",
        minHeight: "160px",
        height: "160px",
        display: "flex",
        flexDirection: "column",
        backgroundColor:
          item.type === "directory" ? "var(--mantine-color-blue-0)" : undefined,
        borderColor:
          item.type === "directory" ? "var(--mantine-color-blue-3)" : undefined,
      }}
      onClick={() => onItemClick(item)}
      onContextMenu={(e) => onContextMenu(e, item)}
    >
      <Group justify="space-between" mb="sm">
        <Group gap="sm">
          {item.type === "directory" ? (
            <IconFolder
              size={32}
              style={{ color: "var(--mantine-primary-color-filled)" }}
            />
          ) : (
            <IconFile size={32} />
          )}
          <div style={{ flex: 1 }}>
            <Text size="sm" fw={500} lineClamp={2}>
              {item.name}
            </Text>
          </div>
        </Group>
        <Menu shadow="md" width={200} position="bottom-end">
          <Menu.Target>
            <ActionIcon
              variant="subtle"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <IconDotsVertical size={16} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item
              leftSection={<IconDownload size={14} />}
              onClick={(e) => {
                e.stopPropagation();
                onDownload(item);
              }}
              style={{
                color: "var(--mantine-color-text)",
                height: "36px",
                fontSize: "0.875rem",
              }}
            >
              {item.type === "directory" ? t("downloadAsZip") : t("download")}
            </Menu.Item>
            <Menu.Item
              leftSection={<IconEdit size={14} />}
              onClick={(e) => {
                e.stopPropagation();
                onRename(item);
              }}
              style={{
                color: "var(--mantine-color-text)",
                height: "36px",
                fontSize: "0.875rem",
              }}
            >
              {t("rename")}
            </Menu.Item>
            <Menu.Item
              leftSection={<IconTrash size={14} />}
              color="red"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(item);
              }}
              style={{
                height: "36px",
                fontSize: "0.875rem",
              }}
            >
              {t("delete")}
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>

      <div style={{ marginTop: "auto" }}>
        <Group justify="space-between" mb="xs">
          <Badge
            variant="light"
            size="sm"
            color={item.type === "directory" ? "blue" : "gray"}
          >
            {item.type === "directory" ? t("folder") : t("file")}
          </Badge>
          {item.type === "file" && item.size && (
            <Text size="xs" c="dimmed">
              {formatFileSize(item.size)}
            </Text>
          )}
        </Group>

        {item.modified && (
          <Text
            size="xs"
            c="dimmed"
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {item.modified}
          </Text>
        )}
      </div>
    </Card>
  );
}
