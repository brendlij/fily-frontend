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
} from "@tabler/icons-react";
import { SettingsButton } from "./SettingsModal";

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

  const pathSegments = currentPath.split("/").filter(Boolean);

  useEffect(() => {
    loadFiles(currentPath);
  }, [currentPath]);

  const loadFiles = async (path: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/files?path=${encodeURIComponent(path)}`
      );
      if (response.ok) {
        const data = await response.json();
        // Next.js API gibt { files: [...] } zurück
        setFiles(data.files || []);
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
    }
  };

  const navigateToPath = (path: string) => {
    setCurrentPath(path);
  };

  const navigateUp = () => {
    const parentPath = pathSegments.slice(0, -1).join("/");
    setCurrentPath(parentPath);
  };

  const handleItemClick = (item: FileItem) => {
    if (item.type === "directory") {
      const newPath = currentPath ? `${currentPath}/${item.name}` : item.name;
      setCurrentPath(newPath);
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
        a.download = item.name;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        notifications.show({
          title: "Erfolg",
          message: `${item.name} wird heruntergeladen`,
          color: "green",
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

  const handleDelete = async (item: FileItem) => {
    if (!confirm(`Möchten Sie "${item.name}" wirklich löschen?`)) return;

    try {
      const filePath = currentPath ? `${currentPath}/${item.name}` : item.name;
      const response = await fetch(
        `/api/files?path=${encodeURIComponent(filePath)}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        notifications.show({
          title: "Erfolg",
          message: `${item.name} wurde gelöscht`,
          color: "green",
        });
        loadFiles(currentPath);
      }
    } catch (error) {
      notifications.show({
        title: "Fehler",
        message: "Löschen fehlgeschlagen",
        color: "red",
      });
    }
  };

  const handleRename = async () => {
    if (!selectedItem || !newName) return;

    try {
      const oldPath = currentPath
        ? `${currentPath}/${selectedItem.name}`
        : selectedItem.name;
      const response = await fetch("/api/files/rename", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          oldPath,
          newName,
        }),
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
        loadFiles(currentPath);
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
        loadFiles(currentPath);
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
    let successCount = 0;

    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);
      if (currentPath) {
        formData.append("path", currentPath);
      }

      try {
        const response = await fetch("/api/files/upload", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          successCount++;
          notifications.show({
            title: "Erfolg",
            message: `${file.name} wurde hochgeladen`,
            color: "green",
          });
        } else {
          notifications.show({
            title: "Fehler",
            message: `Upload von ${file.name} fehlgeschlagen`,
            color: "red",
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

    setUploadModalOpened(false);

    // Aktualisiere die Dateiliste sofort nach dem Upload
    if (successCount > 0) {
      await loadFiles(currentPath);
      notifications.show({
        title: "Upload abgeschlossen",
        message: `${successCount} von ${files.length} Dateien erfolgreich hochgeladen`,
        color: "blue",
      });
    }
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
            <Title order={3}>Fily - File Browser</Title>
          </Group>
          <Group>
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
              Abmelden
            </Button>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <Stack gap="md">
          <Button
            leftSection={<IconHome size={14} />}
            variant="light"
            onClick={() => navigateToPath("")}
            className="enhanced-button"
            style={{ transition: "all 0.2s ease" }}
          >
            Home
          </Button>

          <Button
            leftSection={<IconFolderPlus size={14} />}
            onClick={() => setNewFolderModalOpened(true)}
            className="enhanced-button"
            style={{ transition: "all 0.2s ease" }}
          >
            Neuer Ordner
          </Button>

          <Button
            leftSection={<IconUpload size={14} />}
            onClick={() => setUploadModalOpened(true)}
            className="enhanced-button"
            style={{ transition: "all 0.2s ease" }}
          >
            Datei hochladen
          </Button>
        </Stack>
      </AppShell.Navbar>

      <AppShell.Main>
        <Container fluid>
          <Stack>
            {/* Navigation */}
            <Group className="animate-fade-in">
              {currentPath && (
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
              )}
              <Breadcrumbs separator="›">
                <Anchor
                  onClick={() => navigateToPath("")}
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
                    onClick={() =>
                      navigateToPath(pathSegments.slice(0, index + 1).join("/"))
                    }
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
              mounted={!loading}
              transition="fade"
              duration={400}
              timingFunction="ease-out"
            >
              {(styles) => (
                <div style={styles}>
                  <LoadingOverlay visible={loading} />
                  <Grid>
                    {files.map((item, index) => (
                      <Grid.Col
                        key={index}
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
                            animationDelay: `${index * 0.1}s`,
                            transition: "all 0.3s ease",
                            transform: "translateY(0)",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform =
                              "translateY(-4px)";
                            e.currentTarget.style.boxShadow =
                              "0 8px 25px rgba(0, 0, 0, 0.15)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "";
                          }}
                        >
                          <Group justify="space-between" mb="xs">
                            <Group>
                              {item.type === "directory" ? (
                                <IconFolder size={24} color="blue" />
                              ) : (
                                <IconFile size={24} />
                              )}
                              <Text
                                fw={500}
                                onClick={() => handleItemClick(item)}
                                style={{
                                  cursor:
                                    item.type === "directory"
                                      ? "pointer"
                                      : "inherit",
                                }}
                              >
                                {item.name}
                              </Text>
                            </Group>

                            <Menu position="bottom-end">
                              <Menu.Target>
                                <ActionIcon variant="subtle">
                                  <IconDotsVertical size={16} />
                                </ActionIcon>
                              </Menu.Target>
                              <Menu.Dropdown>
                                {item.type === "file" && (
                                  <Menu.Item
                                    leftSection={<IconDownload size={14} />}
                                    onClick={() => handleDownload(item)}
                                  >
                                    Download
                                  </Menu.Item>
                                )}
                                <Menu.Item
                                  leftSection={<IconEdit size={14} />}
                                  onClick={() => {
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
                                  onClick={() => handleDelete(item)}
                                >
                                  Löschen
                                </Menu.Item>
                              </Menu.Dropdown>
                            </Menu>
                          </Group>

                          <Group justify="space-between">
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
                            <Text size="xs" c="dimmed" mt="xs">
                              {new Date(item.modified).toLocaleDateString(
                                "de-DE"
                              )}
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
          onClose={() => setUploadModalOpened(false)}
          title="Dateien hochladen"
          transitionProps={{
            transition: "slide-up",
            duration: 300,
            timingFunction: "ease-out",
          }}
        >
          <Dropzone
            onDrop={handleUpload}
            multiple
            style={{
              transition: "all 0.2s ease",
              border: "2px dashed #dee2e6",
            }}
            styles={{
              inner: {
                pointerEvents: "all",
              },
            }}
          >
            <Text ta="center" size="lg" mb="md">
              📁 Dateien hier ablegen oder klicken zum Auswählen
            </Text>
            <Text ta="center" size="sm" c="dimmed">
              Mehrere Dateien werden unterstützt
            </Text>
          </Dropzone>
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
      </AppShell.Main>
    </AppShell>
  );
}
