"use client";

import { useState, useEffect } from "react";
import {
  AppShell,
  Burger,
  Group,
  Title,
  Button,
  Text,
  Stack,
  Paper,
  ActionIcon,
  Menu,
  Modal,
  TextInput,
  Grid,
  Card,
  Badge,
  Breadcrumbs,
  Anchor,
  FileInput,
  Container,
  Transition,
  LoadingOverlay,
  Tooltip,
  Progress,
  Select,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { Dropzone, FileWithPath } from "@mantine/dropzone";
import {
  IconFolder,
  IconFile,
  IconDotsVertical,
  IconDownload,
  IconTrash,
  IconEdit,
  IconFolderPlus,
  IconUpload,
  IconHome,
  IconLogout,
  IconRefresh,
  IconSortAscending,
  IconSortDescending,
} from "@tabler/icons-react";
import { SettingsButton } from "./SettingsModal";
import { useTheme } from "../contexts/ThemeContext";
import FilyLogo from "./FilyLogo";

export interface FileItem {
  name: string;
  type: "file" | "directory";
  size?: number;
  modified?: string;
}

interface FileBrowserProps {
  onLogout: () => void;
}

export function FileBrowser({ onLogout }: FileBrowserProps) {
  const [opened, { toggle }] = useDisclosure(false);
  const [currentPath, setCurrentPath] = useState("");
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadModalOpened, setUploadModalOpened] = useState(false);
  const [newFolderModalOpened, setNewFolderModalOpened] = useState(false);
  const [renameModalOpened, setRenameModalOpened] = useState(false);
  const [selectedItem, setSelectedItem] = useState<FileItem | null>(null);
  const [newFolderName, setNewFolderName] = useState("");
  const [newName, setNewName] = useState("");
  const [deleteModalOpened, setDeleteModalOpened] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<FileItem | null>(null);
  const [navigationDirection, setNavigationDirection] = useState<
    "forward" | "backward" | "none"
  >("none");
  const [isNavigating, setIsNavigating] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [currentUploadFile, setCurrentUploadFile] = useState<string>("");
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    item: FileItem | null;
  } | null>(null);

  const { t, language, sortBy, sortDir, setSortBy, setSortDir } = useTheme();

  const pathSegments = currentPath.split("/").filter(Boolean);

  useEffect(() => {
    loadFiles(currentPath, "none");
  }, [currentPath, sortBy, sortDir]);

  // Close context menu when clicking elsewhere
  useEffect(() => {
    const handleClick = () => setContextMenu(null);
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  const loadFiles = async (
    path: string,
    direction: "forward" | "backward" | "none" = "none"
  ) => {
    setIsNavigating(true);
    setNavigationDirection(direction);
    setLoading(true);

    if (direction !== "none") {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    try {
      const response = await fetch(
        `/api/files?path=${encodeURIComponent(path)}`
      );
      if (response.ok) {
        const data = await response.json();
        const transformedFiles = data.map((item: any) => ({
          name: item.name,
          type: item.isDirectory ? "directory" : "file",
          size: item.size,
          modified: item.lastModified
            ? new Date(item.lastModified).toISOString()
            : undefined,
        }));

        const sorted = [...transformedFiles].sort((a, b) => {
          let valA = a[sortBy];
          let valB = b[sortBy];

          // Leere Felder nach hinten sortieren
          if (valA === undefined) return 1;
          if (valB === undefined) return -1;

          if (typeof valA === "string" && typeof valB === "string") {
            return sortDir === "asc"
              ? valA.localeCompare(valB)
              : valB.localeCompare(valA);
          }

          if (typeof valA === "number" && typeof valB === "number") {
            return sortDir === "asc" ? valA - valB : valB - valA;
          }

          return 0;
        });

        setFiles(sorted);
      } else {
        notifications.show({
          title: t("error"),
          message: t("filesCouldNotLoad"),
          color: "red",
        });
      }
    } catch (error) {
      console.error("Error loading files:", error);
      notifications.show({
        title: t("error"),
        message: t("connectionFailed"),
        color: "red",
      });
    } finally {
      setLoading(false);
      setTimeout(() => {
        setIsNavigating(false);
        setNavigationDirection("none");
      }, 300);
    }
  };

  const navigateToPath = (
    path: string,
    direction: "forward" | "backward" = "forward"
  ) => {
    setCurrentPath(path);
    loadFiles(path, direction);
  };

  const navigateUp = () => {
    const parentPath = pathSegments.slice(0, -1).join("/");
    setCurrentPath(parentPath);
    loadFiles(parentPath, "backward");
  };

  const handleItemClick = (item: FileItem) => {
    if (item.type === "directory") {
      const newPath = currentPath ? `${currentPath}/${item.name}` : item.name;
      setCurrentPath(newPath);
      loadFiles(newPath, "forward");
    }
  };

  const handleDownload = async (item: FileItem) => {
    try {
      const filePath = currentPath ? `${currentPath}/${item.name}` : item.name;
      const response = await fetch(
        `/api/files/download?path=${encodeURIComponent(filePath)}`
      );

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;

        // Für Ordner .zip Extension hinzufügen, für Dateien ursprünglichen Namen verwenden
        a.download = item.type === "directory" ? `${item.name}.zip` : item.name;

        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        notifications.show({
          title: t("success"),
          message:
            item.type === "directory"
              ? `${t("folder")} "${item.name}" ${t("downloading")}`
              : `${item.name} ${t("downloading")}`,
          color: "green",
        });
      } else {
        notifications.show({
          title: t("error"),
          message:
            item.type === "directory"
              ? t("zipDownloadFailed")
              : t("downloadFailed"),
          color: "red",
        });
      }
    } catch (error) {
      notifications.show({
        title: t("error"),
        message: t("downloadFailed"),
        color: "red",
      });
    }
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;

    try {
      const filePath = currentPath
        ? `${currentPath}/${itemToDelete.name}`
        : itemToDelete.name;
      const response = await fetch(
        `/api/files?path=${encodeURIComponent(filePath)}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        notifications.show({
          title: t("success"),
          message: `${itemToDelete.name} ${t("deleted")}`,
          color: "green",
        });
        setDeleteModalOpened(false);
        setItemToDelete(null);
        loadFiles(currentPath, "none");
      }
    } catch (error) {
      notifications.show({
        title: t("error"),
        message: t("deleteFailed"),
        color: "red",
      });
    }
  };

  const confirmDelete = (item: FileItem) => {
    setItemToDelete(item);
    setDeleteModalOpened(true);
    setContextMenu(null);
  };

  const handleRightClick = (e: React.MouseEvent, item: FileItem) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      item,
    });
  };

  const handleContextMenu = (e: React.MouseEvent, item: FileItem) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      item,
    });
  };

  const handleRename = async () => {
    if (!selectedItem || !newName) return;

    try {
      const oldPath = currentPath
        ? `${currentPath}/${selectedItem.name}`
        : selectedItem.name;

      // Java-Backend erwartet FormData-Parameter, nicht JSON
      const formData = new FormData();
      formData.append("oldPath", oldPath);
      formData.append("newName", newName);

      const response = await fetch("/api/files/rename", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        notifications.show({
          title: t("success"),
          message: `${selectedItem.name} ${t("renamed")}`,
          color: "green",
        });
        setRenameModalOpened(false);
        setNewName("");
        setSelectedItem(null);
        loadFiles(currentPath, "none");
      }
    } catch (error) {
      notifications.show({
        title: t("error"),
        message: t("renameFailed"),
        color: "red",
      });
    }
  };

  const handleCreateFolder = async () => {
    if (!newFolderName) return;

    try {
      const folderPath = currentPath
        ? `${currentPath}/${newFolderName}`
        : newFolderName;
      const response = await fetch(
        `/api/files/mkdir?path=${encodeURIComponent(folderPath)}`,
        {
          method: "POST",
        }
      );

      if (response.ok) {
        notifications.show({
          title: t("success"),
          message: `${t("folder")} "${newFolderName}" ${t("folderCreated")}`,
          color: "green",
        });
        setNewFolderModalOpened(false);
        setNewFolderName("");
        loadFiles(currentPath, "none");
      }
    } catch (error) {
      notifications.show({
        title: t("error"),
        message: t("folderCreateFailed"),
        color: "red",
      });
    }
  };

  const handleUpload = async (files: FileWithPath[]) => {
    setIsUploading(true);
    setUploadProgress(0);
    let successCount = 0;
    const totalFiles = files.length;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setCurrentUploadFile(file.name);

      try {
        // Verwende XMLHttpRequest für Progress-Tracking
        const success = await uploadFileWithProgress(file, i, totalFiles);
        if (success) {
          successCount++;
          notifications.show({
            title: t("success"),
            message: `${file.name} ${t("uploaded")}`,
            color: "green",
          });
        }
      } catch (error) {
        notifications.show({
          title: t("error"),
          message: `${t("uploadFailed")} ${file.name}`,
          color: "red",
        });
      }
    }

    setIsUploading(false);
    setUploadProgress(0);
    setCurrentUploadFile("");
    setUploadModalOpened(false);

    // Aktualisiere die Dateiliste sofort nach dem Upload
    if (successCount > 0) {
      await loadFiles(currentPath, "none");
      notifications.show({
        title: t("uploadCompleted"),
        message: `${successCount} ${t("filesSuccessfullyUploaded")}`,
        color: "blue",
      });
    }
  };

  const uploadFileWithProgress = (
    file: FileWithPath,
    fileIndex: number,
    totalFiles: number
  ): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append("file", file);
      if (currentPath) {
        formData.append("path", currentPath);
      }

      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          // Berechne den Gesamtfortschritt
          const fileProgress = (event.loaded / event.total) * 100;
          const overallProgress =
            ((fileIndex + fileProgress / 100) / totalFiles) * 100;
          setUploadProgress(Math.round(overallProgress));
        }
      });

      xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(true);
        } else {
          resolve(false);
        }
      });

      xhr.addEventListener("error", () => {
        reject(new Error("Upload failed"));
      });

      xhr.open("POST", "/api/files/upload");
      xhr.send(formData);
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <AppShell
      header={{ height: 100 }}
      navbar={{ width: 300, breakpoint: "sm", collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
            />
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
                onClick={() => loadFiles(currentPath, "none")}
                style={{
                  transition: "all 0.2s ease",
                }}
                className="hover-lift"
              >
                <IconRefresh size={18} />
              </ActionIcon>
            </Tooltip>
            <SettingsButton />
            <Button
              variant="light"
              color="red"
              leftSection={<IconLogout size={14} />}
              onClick={onLogout}
              style={{
                transition: "all 0.2s ease",
              }}
            >
              {t("logout")}
            </Button>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <Stack gap="md">
          <Tooltip label={t("toHome")} position="right">
            <Button
              leftSection={<IconHome size={14} />}
              variant="light"
              onClick={() => navigateToPath("", "backward")}
              className="enhanced-button"
              style={{ transition: "all 0.2s ease" }}
            >
              {t("home")}
            </Button>
          </Tooltip>

          <Tooltip label={t("createNewFolder")} position="right">
            <Button
              leftSection={<IconFolderPlus size={14} />}
              onClick={() => setNewFolderModalOpened(true)}
              className="enhanced-button"
              style={{ transition: "all 0.2s ease" }}
            >
              {t("newFolder")}
            </Button>
          </Tooltip>

          <Tooltip label={t("uploadFiles")} position="right">
            <Button
              leftSection={<IconUpload size={14} />}
              onClick={() => setUploadModalOpened(true)}
              className="enhanced-button"
              style={{ transition: "all 0.2s ease" }}
            >
              {t("uploadFile")}
            </Button>
          </Tooltip>
        </Stack>
      </AppShell.Navbar>

      <AppShell.Main>
        <Container fluid>
          <Stack>
            {/* Navigation */}
            <Group justify="flex-end" align="center" gap="xs">
              <Text size="sm" c="dimmed">
                Sortieren:
              </Text>
              <Select
                value={sortBy}
                onChange={(value) => setSortBy(value as any)}
                data={[
                  { value: "name", label: "Name" },
                  { value: "type", label: "Typ" },
                  { value: "modified", label: "Geändert" },
                  { value: "size", label: "Größe" },
                ]}
                size="sm"
                radius="md"
                w={160}
              />
              <ActionIcon
                variant="light"
                color="primary"
                size="md"
                radius="md"
                onClick={() => setSortDir(sortDir === "asc" ? "desc" : "asc")}
                title={sortDir === "asc" ? "Aufsteigend" : "Absteigend"}
              >
                {sortDir === "asc" ? (
                  <IconSortAscending size={18} />
                ) : (
                  <IconSortDescending size={18} />
                )}
              </ActionIcon>
            </Group>

            <Group className="animate-fade-in">
              {currentPath && (
                <Tooltip label={t("oneStepBack")} position="bottom">
                  <Button
                    variant="light"
                    size="sm"
                    onClick={navigateUp}
                    leftSection={<IconFolder size={14} />}
                    style={{
                      transition: "all 0.2s ease",
                    }}
                    className="hover-lift"
                  >
                    {t("back")}
                  </Button>
                </Tooltip>
              )}
              <Breadcrumbs separator="›">
                <Anchor
                  onClick={() => navigateToPath("", "backward")}
                  style={{
                    transition: "all 0.2s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                  className="hover-scale"
                >
                  <IconHome size={16} />
                  <span>Home</span>
                </Anchor>
                {pathSegments.map((segment, index) => (
                  <Anchor
                    key={index}
                    onClick={() => {
                      const targetPath = pathSegments
                        .slice(0, index + 1)
                        .join("/");
                      const isGoingBack =
                        targetPath.length < currentPath.length;
                      navigateToPath(
                        targetPath,
                        isGoingBack ? "backward" : "forward"
                      );
                    }}
                    style={{ transition: "all 0.2s ease" }}
                    className="hover-scale"
                  >
                    {segment}
                  </Anchor>
                ))}
              </Breadcrumbs>
            </Group>

            {/* File Grid */}
            <Transition
              mounted={!loading && !isNavigating}
              transition={{
                in: {
                  opacity: 1,
                  transform:
                    navigationDirection === "forward"
                      ? "translateX(0)"
                      : navigationDirection === "backward"
                      ? "translateX(0)"
                      : "translateX(0)",
                },
                out: {
                  opacity: 0,
                  transform:
                    navigationDirection === "forward"
                      ? "translateX(-30px)"
                      : navigationDirection === "backward"
                      ? "translateX(30px)"
                      : "translateX(0)",
                },
                common: { transformOrigin: "center" },
                transitionProperty: "transform, opacity",
              }}
              duration={300}
              timingFunction="cubic-bezier(0.4, 0, 0.2, 1)"
            >
              {(styles) => (
                <div style={styles}>
                  <LoadingOverlay visible={loading} />
                  <Grid>
                    {files.map((item, index) => (
                      <Grid.Col
                        key={`${currentPath}-${item.name}-${index}`}
                        span={{ base: 6, sm: 4, md: 3, lg: 3 }}
                      >
                        <Card
                          key={item.name}
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
                              item.type === "directory"
                                ? "var(--mantine-color-blue-0)"
                                : undefined,
                            borderColor:
                              item.type === "directory"
                                ? "var(--mantine-color-blue-3)"
                                : undefined,
                          }}
                          onClick={() => handleItemClick(item)}
                          onContextMenu={(e) => handleRightClick(e, item)}
                        >
                          <Group justify="space-between" mb="sm">
                            <Group gap="sm">
                              {item.type === "directory" ? (
                                <IconFolder
                                  size={32}
                                  style={{
                                    color:
                                      "var(--mantine-primary-color-filled)",
                                  }}
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
                                    handleDownload(item);
                                  }}
                                  style={{
                                    color: "var(--mantine-color-text)",
                                    height: "36px",
                                    fontSize: "0.875rem",
                                  }}
                                >
                                  {item.type === "directory"
                                    ? t("downloadAsZip")
                                    : t("download")}
                                </Menu.Item>
                                <Menu.Item
                                  leftSection={<IconEdit size={14} />}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedItem(item);
                                    setNewName(item.name);
                                    setRenameModalOpened(true);
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
                                    confirmDelete(item);
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
                                color={
                                  item.type === "directory" ? "blue" : "gray"
                                }
                              >
                                {item.type === "directory"
                                  ? t("folder")
                                  : t("file")}
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
                      </Grid.Col>
                    ))}
                  </Grid>
                </div>
              )}
            </Transition>
          </Stack>
        </Container>

        {/* Upload Modal */}
        <Modal
          opened={uploadModalOpened}
          onClose={() => !isUploading && setUploadModalOpened(false)}
          title={t("uploadFilesModal")}
          transitionProps={{
            transition: "slide-up",
            duration: 300,
            timingFunction: "ease-out",
          }}
          closeOnClickOutside={!isUploading}
          closeOnEscape={!isUploading}
        >
          <Stack>
            {isUploading ? (
              <Stack>
                <Text size="sm" c="dimmed" ta="center">
                  {currentUploadFile &&
                    `${t("uploading")}: ${currentUploadFile}`}
                </Text>
                <Progress
                  value={uploadProgress}
                  size="lg"
                  radius="md"
                  animated
                  color="blue"
                  style={{ transition: "all 0.3s ease" }}
                />
                <Text size="xs" c="dimmed" ta="center">
                  {uploadProgress}% {t("completed")}
                </Text>
              </Stack>
            ) : (
              <Dropzone
                onDrop={handleUpload}
                multiple
                style={{
                  transition: "all 0.2s ease",
                  border: "2px dashed var(--mantine-primary-color-4)",
                  borderRadius: "var(--mantine-radius-md)",
                  backgroundColor: "var(--mantine-color-gray-0)",
                  padding: "2rem",
                }}
                styles={{
                  inner: {
                    pointerEvents: "all",
                  },
                }}
              >
                <Group justify="center" mb="md">
                  <IconUpload
                    size={32}
                    color="var(--mantine-primary-color-6)"
                  />
                </Group>
                <Text ta="center" size="lg" mb="md" fw={500}>
                  {t("dragDropFiles")}
                </Text>
                <Text ta="center" size="sm" c="dimmed">
                  {t("multipleSupported")}
                </Text>
              </Dropzone>
            )}
          </Stack>
        </Modal>

        {/* New Folder Modal */}
        <Modal
          opened={newFolderModalOpened}
          onClose={() => setNewFolderModalOpened(false)}
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
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.currentTarget.value)}
              placeholder={t("enterFolderName")}
              data-autofocus
            />
            <Group justify="flex-end">
              <Button
                variant="subtle"
                onClick={() => setNewFolderModalOpened(false)}
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

        {/* Rename Modal */}
        <Modal
          opened={renameModalOpened}
          onClose={() => setRenameModalOpened(false)}
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
                onClick={() => setRenameModalOpened(false)}
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

        {/* Delete Confirmation Modal */}
        <Modal
          opened={deleteModalOpened}
          onClose={() => setDeleteModalOpened(false)}
          title={t("confirmDelete")}
          transitionProps={{
            transition: "slide-up",
            duration: 300,
            timingFunction: "ease-out",
          }}
        >
          <Stack>
            <Text>
              Möchten Sie <strong>"{itemToDelete?.name}"</strong>{" "}
              {t("deleteConfirmation")}
            </Text>
            <Text size="sm" c="dimmed">
              {itemToDelete?.type === "directory"
                ? t("deleteWarningFolder")
                : t("deleteWarningFile")}
            </Text>
            <Group justify="flex-end">
              <Button
                variant="subtle"
                onClick={() => setDeleteModalOpened(false)}
                style={{ transition: "all 0.2s ease" }}
              >
                {t("cancel")}
              </Button>
              <Button
                color="red"
                onClick={handleDelete}
                style={{ transition: "all 0.2s ease" }}
              >
                {t("delete")}
              </Button>
            </Group>
          </Stack>
        </Modal>
      </AppShell.Main>

      {/* Context Menu */}
      {contextMenu && (
        <Menu
          opened
          withArrow
          withinPortal={false}
          closeOnItemClick={false}
          position="bottom" // Pflicht, wird ignoriert durch styles
          styles={{
            dropdown: {
              position: "fixed",
              top: contextMenu.y,
              left: contextMenu.x,
              transform: "none", // verhindert zentrierung
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
                  handleDownload(contextMenu.item);
                  setContextMenu(null);
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
                  setSelectedItem(contextMenu.item);
                  setNewName(contextMenu.item.name);
                  setRenameModalOpened(true);
                  setContextMenu(null);
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
                  confirmDelete(contextMenu.item);
                  setContextMenu(null);
                }
              }}
            >
              {t("delete")}
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      )}
    </AppShell>
  );
}
