"use client";

import { ActionIcon, Badge, Card, Group, Menu, Text } from "@mantine/core";
import {
  IconDotsVertical,
  IconDownload,
  IconEdit,
  IconFile,
  IconFolder,
  IconTrash,
  IconFileTypePdf,
  IconFileTypeJpg,
  IconFileTypePng,
  IconFileTypeDoc,
  IconGif,
  IconFileWord,
  IconFileExcel,
  IconFileTypeTxt,
  IconFileTypeDocx,
  IconFileTypeXls,
  IconFileTypeZip,
  IconFileTypeCsv,
  IconJson,
  IconHtml,
  IconFileTypeTsx,
  IconFileTypeTs,
  IconFileTypePpt,
  IconFileTypeJs,
  IconFileTypePhp,
  IconFileTypeXml,
  IconFileTypeJsx,
  IconFileTypeVue,
  IconFileTypeRs,
  IconFileTypeCss,
  IconFileTypeBmp,
  IconFileTypeSvg,
  IconFileTypeSql,
  IconMovie,
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
  // Drag & Drop Props
  isDragging?: boolean;
  isDropTarget?: boolean;
  onDragStart?: (e: React.DragEvent, item: FileItem) => void;
  onDragOver?: (e: React.DragEvent, item: FileItem) => void;
  onDrop?: (e: React.DragEvent, item: FileItem) => void;
  onDragEnd?: (e: React.DragEvent) => void;
}

const iconMap: Record<string, React.ReactNode> = {
  pdf: <IconFileTypePdf size={32} color="#e02f2f" />,
  jpg: <IconFileTypeJpg size={32} color="#f07c00" />,
  jpeg: <IconFileTypeJpg size={32} color="#f07c00" />,
  png: <IconFileTypePng size={32} color="#2a9df4" />,
  doc: <IconFileTypeDoc size={32} color="#185abd" />,
  docx: <IconFileTypeDocx size={32} color="#185abd" />,
  gif: <IconGif size={32} color="#eae311" />,
  xls: <IconFileTypeXls size={32} color="#207245" />,
  xlsx: <IconFileTypeXls size={32} color="#207245" />,
  csv: <IconFileTypeCsv size={32} color="#207245" />,
  zip: <IconFileTypeZip size={32} color="#666666" />,
  txt: <IconFileTypeTxt size={32} color="#999999" />,
  json: <IconJson size={32} color="#f89406" />,
  html: <IconHtml size={32} color="#e34f26" />,
  ts: <IconFileTypeTs size={32} color="#3178c6" />,
  tsx: <IconFileTypeTsx size={32} color="#3178c6" />,
  js: <IconFileTypeJs size={32} color="#f7df1e" />,
  jsx: <IconFileTypeJsx size={32} color="#61dafb" />,
  css: <IconFileTypeCss size={32} color="#2965f1" />,
  php: <IconFileTypePhp size={32} color="#777bb3" />,
  xml: <IconFileTypeXml size={32} color="#0060ac" />,
  ppt: <IconFileTypePpt size={32} color="#d24726" />,
  vue: <IconFileTypeVue size={32} color="#42b883" />,
  rs: <IconFileTypeRs size={32} color="#dea584" />,
  bmp: <IconFileTypeBmp size={32} color="#999999" />,
  svg: <IconFileTypeSvg size={32} color="#ffb13b" />,
  sql: <IconFileTypeSql size={32} color="#d2691e" />,
  mp4: <IconMovie size={32} color="#f00" />,
  avi: <IconMovie size={32} color="#f00" />,
};

export function FileCard({
  item,
  onItemClick,
  onDownload,
  onRename,
  onDelete,
  onContextMenu,
  formatFileSize,
  // Drag & Drop Props
  isDragging,
  isDropTarget,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  "data-file-id": dataFileId,
  ...otherProps
}: FileCardProps & { "data-file-id"?: string }) {
  const { t } = useTheme();

  const ext =
    item.type === "file" && item.name
      ? item.name.split(".").pop()?.toLowerCase()
      : null;

  const iconForExt =
    ext && iconMap[ext] ? iconMap[ext] : <IconFile size={32} />;

  return (
    <Card
      p="md"
      withBorder
      data-file-id={dataFileId || item.path}
      className={`hover-lift ${isDragging ? "dragging" : ""} ${
        isDropTarget ? "drop-target" : ""
      }`}
      style={{
        cursor: "pointer",
        transition: "all 0.2s ease",
        minHeight: 160,
        height: 160,
        display: "flex",
        flexDirection: "column",
        position: "relative",
        backgroundColor: isDropTarget
          ? "var(--mantine-color-green-light)"
          : item.type === "directory"
          ? "var(--mantine-color-primary-filled)"
          : undefined,
        borderColor: isDropTarget
          ? "var(--mantine-color-green-filled)"
          : item.type === "directory"
          ? "var(--mantine-primary-color-filled)"
          : undefined,
        opacity: isDragging ? 0.6 : 1,
        transform: isDropTarget ? "scale(1.05)" : undefined,
      }}
      onClick={() => onItemClick(item)}
      onContextMenu={(e) => onContextMenu(e, item)}
      draggable={item.type === "file"}
      onDragStart={onDragStart ? (e) => onDragStart(e, item) : undefined}
      onDragOver={onDragOver ? (e) => onDragOver(e, item) : undefined}
      onDrop={onDrop ? (e) => onDrop(e, item) : undefined}
      onDragEnd={onDragEnd}
    >
      {/* 3-Punkte-Icon oben rechts */}
      <div
        style={{
          position: "absolute",
          top: 8,
          right: 8,
          zIndex: 10,
        }}
      >
        <Menu shadow="md" width={200} position="bottom-end">
          <Menu.Target>
            <ActionIcon
              variant="subtle"
              size="sm"
              onClick={(e) => e.stopPropagation()}
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
                height: 36,
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
                height: 36,
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
              style={{ height: 36, fontSize: "0.875rem" }}
            >
              {t("delete")}
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </div>

      <Group mb="sm" gap="sm" style={{ alignItems: "center" }}>
        {item.type === "directory" ? (
          <IconFolder
            size={32}
            style={{ color: "var(--mantine-primary-color-filled)" }}
          />
        ) : (
          iconForExt
        )}
        <Text
          size="sm"
          fw={500}
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "calc(100% - 40px)",
          }}
          title={item.name}
        >
          {item.name}
        </Text>
      </Group>

      <div style={{ marginTop: "auto" }}>
        <Group justify="space-between" mb="xs" align="center" gap="xs">
          <Group gap={6}>
            <Badge
              variant="light"
              size="sm"
              color={
                item.type === "directory"
                  ? "var(--mantine-primary-color-filled)"
                  : "gray"
              }
            >
              {item.type === "directory" ? t("folder") : t("file")}
            </Badge>
            {ext && (
              <Badge
                variant="outline"
                size="sm"
                color="violet"
                style={{ textTransform: "uppercase" }}
              >
                {ext}
              </Badge>
            )}
          </Group>

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
