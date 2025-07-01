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

  const { t, language } = useTheme();

  const pathSegments = currentPath.split("/").filter(Boolean);

  useEffect(() => {
    loadFiles(currentPath, "none");
  }, []);

  const loadFiles = async (
    path: string,
    direction: "forward" | "backward" | "none" = "none"
  ) => {
    setIsNavigating(true);
    setNavigationDirection(direction);
    setLoading(true);

    // Kurze Verzögerung für smooth animation start
    if (direction !== "none") {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    try {
      const response = await fetch(
        `/api/files?path=${encodeURIComponent(path)}`
      );
      if (response.ok) {
        const data = await response.json();
        // Java-Backend gibt direkt ein Array zurück
        // Transformiere die Backend-Daten in das Frontend-Format
        const transformedFiles = data.map((item: any) => ({
          name: item.name,
          type: item.isDirectory ? "directory" : "file",
          size: item.size,
          modified: item.lastModified
            ? new Date(item.lastModified).toLocaleDateString("de-DE")
            : undefined,
        }));
        setFiles(transformedFiles);
      } else {
        notifications.show({
          title: "Fehler",
          message: "Dateien konnten nicht geladen werden",
          color: "red",
        });
      }
    } catch (error) {
      console.error("Error loading files:", error);
      notifications.show({
        title: "Fehler",
        message: "Verbindung zum Server fehlgeschlagen",
        color: "red",
      });
    } finally {
      setLoading(false);
      // Animation completion delay
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
          title: "Erfolg",
          message:
            item.type === "directory"
              ? `Ordner "${item.name}" wird als ZIP heruntergeladen`
              : `${item.name} wird heruntergeladen`,
          color: "green",
        });
      } else {
        notifications.show({
          title: "Fehler",
          message:
            item.type === "directory"
              ? "ZIP-Download fehlgeschlagen"
              : "Download fehlgeschlagen",
          color: "red",
        });
      }
    } catch (error) {
      notifications.show({
        title: "Fehler",
        message: "Download fehlgeschlagen",
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
          title: "Erfolg",
          message: `${itemToDelete.name} wurde gelöscht`,
          color: "green",
        });
        setDeleteModalOpened(false);
        setItemToDelete(null);
        loadFiles(currentPath, "none");
      }
    } catch (error) {
      notifications.show({
        title: "Fehler",
        message: "Löschen fehlgeschlagen",
        color: "red",
      });
    }
  };

  const confirmDelete = (item: FileItem) => {
    setItemToDelete(item);
    setDeleteModalOpened(true);
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
          title: "Erfolg",
          message: `${selectedItem.name} wurde umbenannt`,
          color: "green",
        });
        setRenameModalOpened(false);
        setNewName("");
        setSelectedItem(null);
        loadFiles(currentPath, "none");
      }
    } catch (error) {
      notifications.show({
        title: "Fehler",
        message: "Umbenennen fehlgeschlagen",
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
          title: "Erfolg",
          message: `Ordner "${newFolderName}" wurde erstellt`,
          color: "green",
        });
        setNewFolderModalOpened(false);
        setNewFolderName("");
        loadFiles(currentPath, "none");
      }
    } catch (error) {
      notifications.show({
        title: "Fehler",
        message: "Ordner konnte nicht erstellt werden",
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
            title: "Erfolg",
            message: `${file.name} wurde hochgeladen`,
            color: "green",
          });
        }
      } catch (error) {
        notifications.show({
          title: "Fehler",
          message: `Upload von ${file.name} fehlgeschlagen`,
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
        title: "Upload abgeschlossen",
        message: `${successCount} von ${files.length} Dateien erfolgreich hochgeladen`,
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
      header={{ height: 60 }}
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
              <FilyLogo width={32} height={32} />
              <Title order={3}>{t("title")}</Title>
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
          <Tooltip label="Zur Startseite" position="right">
            <Button
              leftSection={<IconHome size={14} />}
              variant="light"
              onClick={() => navigateToPath("", "backward")}
              className="enhanced-button"
              style={{ transition: "all 0.2s ease" }}
            >
              Home
            </Button>
          </Tooltip>

          <Tooltip label="Neuen Ordner erstellen" position="right">
            <Button
              leftSection={<IconFolderPlus size={14} />}
              onClick={() => setNewFolderModalOpened(true)}
              className="enhanced-button"
              style={{ transition: "all 0.2s ease" }}
            >
              Neuer Ordner
            </Button>
          </Tooltip>

          <Tooltip label="Dateien hochladen" position="right">
            <Button
              leftSection={<IconUpload size={14} />}
              onClick={() => setUploadModalOpened(true)}
              className="enhanced-button"
              style={{ transition: "all 0.2s ease" }}
            >
              Datei hochladen
            </Button>
          </Tooltip>
        </Stack>
      </AppShell.Navbar>

      <AppShell.Main>
        <Container fluid>
          <Stack>
            {/* Navigation */}
            <Group className="animate-fade-in">
              {currentPath && (
                <Tooltip label="Einen Ordner zurück" position="bottom">
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
                    Zurück
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
                        span={{ base: 12, sm: 6, md: 4, lg: 3 }}
                      >
                        <Card
                          shadow="sm"
                          padding="lg"
                          radius="md"
                          withBorder
                          className="animate-slide-up"
                          style={{
                            cursor:
                              item.type === "directory" ? "pointer" : "default",
                            animationDelay: `${index * 0.05}s`,
                            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                            transform: "translateY(0)",
                            height: "160px",
                            display: "flex",
                            flexDirection: "column",
                          }}
                          onMouseEnter={(e) => {
                            if (!isNavigating) {
                              e.currentTarget.style.transform =
                                "translateY(-4px)";
                              e.currentTarget.style.boxShadow =
                                "0 8px 25px rgba(0, 0, 0, 0.15)";
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isNavigating) {
                              e.currentTarget.style.transform = "translateY(0)";
                              e.currentTarget.style.boxShadow = "";
                            }
                          }}
                          onClick={() =>
                            !isNavigating &&
                            item.type === "directory" &&
                            handleItemClick(item)
                          }
                        >
                          <Group
                            justify="space-between"
                            mb="xs"
                            style={{ minHeight: "32px" }}
                          >
                            <Group style={{ flex: 1, minWidth: 0 }}>
                              {item.type === "directory" ? (
                                <IconFolder size={24} color="blue" />
                              ) : (
                                <IconFile size={24} />
                              )}
                              <Text
                                fw={500}
                                style={{
                                  cursor:
                                    item.type === "directory"
                                      ? "pointer"
                                      : "inherit",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                  flex: 1,
                                  minWidth: 0,
                                }}
                                title={item.name} // Tooltip für vollständigen Namen
                              >
                                {item.name}
                              </Text>
                            </Group>

                            <Menu position="bottom-end">
                              <Menu.Target>
                                <Tooltip label="Aktionen" position="left">
                                  <ActionIcon
                                    variant="subtle"
                                    onClick={(e) => e.stopPropagation()} // Verhindert Navigation beim Klick auf Menü
                                  >
                                    <IconDotsVertical size={16} />
                                  </ActionIcon>
                                </Tooltip>
                              </Menu.Target>
                              <Menu.Dropdown>
                                <Menu.Item
                                  leftSection={<IconDownload size={14} />}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDownload(item);
                                  }}
                                >
                                  {item.type === "directory"
                                    ? "Als ZIP herunterladen"
                                    : "Download"}
                                </Menu.Item>
                                <Menu.Item
                                  leftSection={<IconEdit size={14} />}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedItem(item);
                                    setNewName(item.name);
                                    setRenameModalOpened(true);
                                  }}
                                >
                                  Umbenennen
                                </Menu.Item>
                                <Menu.Item
                                  leftSection={<IconTrash size={14} />}
                                  color="red"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    confirmDelete(item);
                                  }}
                                >
                                  Löschen
                                </Menu.Item>
                              </Menu.Dropdown>
                            </Menu>
                          </Group>

                          <Group
                            justify="space-between"
                            style={{ marginTop: "auto" }}
                          >
                            <Badge variant="light" size="sm">
                              {item.type === "directory" ? "Ordner" : "Datei"}
                            </Badge>
                            {item.size && (
                              <Text size="sm" c="dimmed">
                                {formatFileSize(item.size)}
                              </Text>
                            )}
                          </Group>

                          {item.modified && (
                            <Text
                              size="xs"
                              c="dimmed"
                              mt="xs"
                              style={{
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {item.modified}
                            </Text>
                          )}
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
          title="Dateien hochladen"
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
                  {currentUploadFile && `Uploading: ${currentUploadFile}`}
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
                  {uploadProgress}% abgeschlossen
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
                  Dateien hier ablegen oder klicken zum Auswählen
                </Text>
                <Text ta="center" size="sm" c="dimmed">
                  Mehrere Dateien werden unterstützt
                </Text>
              </Dropzone>
            )}
          </Stack>
        </Modal>

        {/* New Folder Modal */}
        <Modal
          opened={newFolderModalOpened}
          onClose={() => setNewFolderModalOpened(false)}
          title="Neuen Ordner erstellen"
          transitionProps={{
            transition: "slide-up",
            duration: 300,
            timingFunction: "ease-out",
          }}
        >
          <Stack>
            <TextInput
              label="Ordnername"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.currentTarget.value)}
              placeholder="Ordnername eingeben"
              data-autofocus
            />
            <Group justify="flex-end">
              <Button
                variant="subtle"
                onClick={() => setNewFolderModalOpened(false)}
                style={{ transition: "all 0.2s ease" }}
              >
                Abbrechen
              </Button>
              <Button
                onClick={handleCreateFolder}
                style={{ transition: "all 0.2s ease" }}
              >
                Erstellen
              </Button>
            </Group>
          </Stack>
        </Modal>

        {/* Rename Modal */}
        <Modal
          opened={renameModalOpened}
          onClose={() => setRenameModalOpened(false)}
          title="Umbenennen"
          transitionProps={{
            transition: "slide-up",
            duration: 300,
            timingFunction: "ease-out",
          }}
        >
          <Stack>
            <TextInput
              label="Neuer Name"
              value={newName}
              onChange={(e) => setNewName(e.currentTarget.value)}
              placeholder="Neuen Namen eingeben"
              data-autofocus
            />
            <Group justify="flex-end">
              <Button
                variant="subtle"
                onClick={() => setRenameModalOpened(false)}
                style={{ transition: "all 0.2s ease" }}
              >
                Abbrechen
              </Button>
              <Button
                onClick={handleRename}
                style={{ transition: "all 0.2s ease" }}
              >
                Umbenennen
              </Button>
            </Group>
          </Stack>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          opened={deleteModalOpened}
          onClose={() => setDeleteModalOpened(false)}
          title="Löschen bestätigen"
          transitionProps={{
            transition: "slide-up",
            duration: 300,
            timingFunction: "ease-out",
          }}
        >
          <Stack>
            <Text>
              Möchten Sie <strong>"{itemToDelete?.name}"</strong> wirklich
              löschen?
            </Text>
            <Text size="sm" c="dimmed">
              {itemToDelete?.type === "directory"
                ? "Dieser Ordner und alle enthaltenen Dateien werden permanent gelöscht."
                : "Diese Datei wird permanent gelöscht."}
            </Text>
            <Group justify="flex-end">
              <Button
                variant="subtle"
                onClick={() => setDeleteModalOpened(false)}
                style={{ transition: "all 0.2s ease" }}
              >
                Abbrechen
              </Button>
              <Button
                color="red"
                onClick={handleDelete}
                style={{ transition: "all 0.2s ease" }}
              >
                Löschen
              </Button>
            </Group>
          </Stack>
        </Modal>
      </AppShell.Main>
    </AppShell>
  );
}
