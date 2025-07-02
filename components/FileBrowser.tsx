"use client";

import { useState, useEffect } from "react";
import { AppShell, Container, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { FileWithPath } from "@mantine/dropzone";
import { useTheme } from "../contexts/ThemeContext";

// Import components
import { FileHeader } from "./FileBrowser/FileHeader";
import { FileToolbar } from "./FileBrowser/FileToolbar";
import { FileBreadcrumbs } from "./FileBrowser/FileBreadcrumbs";
import { SortControls } from "./FileBrowser/SortControls";
import { FileGrid } from "./FileBrowser/FileGrid";
import { UploadModal } from "./FileBrowser/UploadModal";
import { NewFolderModal } from "./FileBrowser/NewFolderModal";
import { RenameModal } from "./FileBrowser/RenameModal";
import { DeleteModal } from "./FileBrowser/DeleteModal";
import { ContextMenu } from "./FileBrowser/ContextMenu";

// Import types
import { FileItem, ContextMenuType } from "./FileBrowser/types";

interface FileBrowserProps {
  onLogout: () => void;
}

export function FileBrowser({ onLogout }: FileBrowserProps) {
  // State
  const [opened, { toggle }] = useDisclosure(false);
  const [currentPath, setCurrentPath] = useState("");
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadModalOpened, setUploadModalOpened] = useState(false);
  const [newFolderModalOpened, setNewFolderModalOpened] = useState(false);
  const [renameModalOpened, setRenameModalOpened] = useState(false);
  const [selectedItem, setSelectedItem] = useState<FileItem | null>(null);
  const [deleteModalOpened, setDeleteModalOpened] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<FileItem | null>(null);
  const [navigationDirection, setNavigationDirection] = useState<
    "forward" | "backward" | "none"
  >("none");
  const [isNavigating, setIsNavigating] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [currentUploadFile, setCurrentUploadFile] = useState<string>("");
  const [contextMenu, setContextMenu] = useState<ContextMenuType | null>(null);

  // Get theme settings and translations
  const { t, sortBy, sortDir, setSortBy, setSortDir } = useTheme();

  const pathSegments = currentPath.split("/").filter(Boolean);

  // Effects
  useEffect(() => {
    loadFiles(currentPath, "none");
  }, [currentPath, sortBy, sortDir]);

  // Close context menu when clicking elsewhere
  useEffect(() => {
    const handleClick = () => setContextMenu(null);
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  // Check token validity on component mount
  useEffect(() => {
    const checkTokenValidity = () => {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        onLogout();
        return;
      }

      try {
        // Parse the JWT token (without verification)
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
          window
            .atob(base64)
            .split("")
            .map((c) => {
              return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join("")
        );

        const payload = JSON.parse(jsonPayload);

        // Check if token has expired
        if (payload.exp && payload.exp * 1000 < Date.now()) {
          notifications.show({
            title: t("error"),
            message: t("sessionExpired"),
            color: "red",
            position: "bottom-right",
          });
          onLogout();
        }
      } catch (error) {
        // If there's any error parsing the token, consider it invalid
        console.error("Error checking token validity:", error);
        onLogout();
      }
    };

    // Check on mount
    checkTokenValidity();

    // And check periodically
    const intervalId = setInterval(checkTokenValidity, 60000); // Every minute

    return () => clearInterval(intervalId);
  }, [onLogout, t]);

  // Functions for file operations
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
      const token = localStorage.getItem("auth_token");
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const response = await fetch(
        `${baseUrl}/files?path=${encodeURIComponent(path)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Handle 401 Unauthorized - token expired or invalid
      if (response.status === 401) {
        notifications.show({
          title: t("error"),
          message: t("sessionExpired"),
          color: "red",
          position: "bottom-right",
        });
        onLogout();
        return;
      }

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
          position: "bottom-right",
        });
      }
    } catch (error) {
      console.error("Error loading files:", error);
      notifications.show({
        title: t("error"),
        message: t("connectionFailed"),
        color: "red",
        position: "bottom-right",
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
      const token = localStorage.getItem("auth_token");
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const response = await fetch(
        `${baseUrl}/files/download?path=${encodeURIComponent(filePath)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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
          position: "bottom-right",
        });
      } else {
        notifications.show({
          title: t("error"),
          message:
            item.type === "directory"
              ? t("zipDownloadFailed")
              : t("downloadFailed"),
          color: "red",
          position: "bottom-right",
        });
      }
    } catch (error) {
      notifications.show({
        title: t("error"),
        message: t("downloadFailed"),
        color: "red",
        position: "bottom-right",
      });
    }
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;

    try {
      const filePath = currentPath
        ? `${currentPath}/${itemToDelete.name}`
        : itemToDelete.name;
      const token = localStorage.getItem("auth_token");
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const response = await fetch(
        `${baseUrl}/files?path=${encodeURIComponent(filePath)}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        notifications.show({
          title: t("success"),
          message: `${itemToDelete.name} ${t("deleted")}`,
          color: "green",
          position: "bottom-right",
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
        position: "bottom-right",
      });
    }
  };

  const confirmDelete = (item: FileItem) => {
    setItemToDelete(item);
    setDeleteModalOpened(true);
    setContextMenu(null);
  };

  const handleContextMenu = (e: React.MouseEvent, item: FileItem) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      item,
    });
  };

  const handleRename = async (newName: string) => {
    if (!selectedItem || !newName) return;

    try {
      const oldPath = currentPath
        ? `${currentPath}/${selectedItem.name}`
        : selectedItem.name;

      const token = localStorage.getItem("auth_token");
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";

      // According to documentation, rename uses query parameters
      const response = await fetch(
        `${baseUrl}/files/rename?oldPath=${encodeURIComponent(
          oldPath
        )}&newName=${encodeURIComponent(newName)}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        notifications.show({
          title: t("success"),
          message: `${selectedItem.name} ${t("renamed")}`,
          color: "green",
          position: "bottom-right",
        });
        setRenameModalOpened(false);
        setSelectedItem(null);
        loadFiles(currentPath, "none");
      }
    } catch (error) {
      notifications.show({
        title: t("error"),
        message: t("renameFailed"),
        color: "red",
        position: "bottom-right",
      });
    }
  };

  const handleCreateFolder = async (name: string) => {
    if (!name) return;

    try {
      const folderPath = currentPath ? `${currentPath}/${name}` : name;
      const token = localStorage.getItem("auth_token");
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const response = await fetch(
        `${baseUrl}/files/mkdir?path=${encodeURIComponent(folderPath)}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        notifications.show({
          title: t("success"),
          message: `${t("folder")} "${name}" ${t("folderCreated")}`,
          color: "green",
          position: "bottom-right",
        });
        setNewFolderModalOpened(false);
        loadFiles(currentPath, "none");
      }
    } catch (error) {
      notifications.show({
        title: t("error"),
        message: t("folderCreateFailed"),
        color: "red",
        position: "bottom-right",
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
            position: "bottom-right",
          });
        }
      } catch (error) {
        notifications.show({
          title: t("error"),
          message: `${t("uploadFailed")} ${file.name}`,
          color: "red",
          position: "bottom-right",
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
        position: "bottom-right",
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

      const token = localStorage.getItem("auth_token");
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
      xhr.open("POST", `${baseUrl}/files/upload`);
      xhr.setRequestHeader("Authorization", `Bearer ${token}`);
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
        <FileHeader
          opened={opened}
          toggle={toggle}
          onLogout={onLogout}
          onRefresh={() => loadFiles(currentPath, "none")}
        />
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <FileToolbar
          onGoHome={() => navigateToPath("", "backward")}
          onNewFolder={() => setNewFolderModalOpened(true)}
          onUpload={() => setUploadModalOpened(true)}
        />
      </AppShell.Navbar>

      <AppShell.Main>
        <Container fluid>
          <Stack>
            {/* Sort Controls */}
            <SortControls
              sortBy={sortBy}
              sortDir={sortDir}
              onSortByChange={(val) => setSortBy(val)}
              onSortDirChange={(val) => setSortDir(val)}
            />

            {/* Navigation Breadcrumbs */}
            <FileBreadcrumbs
              currentPath={currentPath}
              onNavigateUp={navigateUp}
              onNavigateTo={navigateToPath}
            />

            {/* File Grid */}
            <FileGrid
              files={files}
              currentPath={currentPath}
              loading={loading}
              isNavigating={isNavigating}
              navigationDirection={navigationDirection}
              onItemClick={handleItemClick}
              onDownload={handleDownload}
              onRename={(item) => {
                setSelectedItem(item);
                setRenameModalOpened(true);
              }}
              onDelete={confirmDelete}
              onContextMenu={handleContextMenu}
              formatFileSize={formatFileSize}
            />
          </Stack>
        </Container>

        {/* Modals */}
        <UploadModal
          opened={uploadModalOpened}
          onClose={() => setUploadModalOpened(false)}
          onUpload={handleUpload}
          isUploading={isUploading}
          uploadProgress={uploadProgress}
          currentUploadFile={currentUploadFile}
        />

        <NewFolderModal
          opened={newFolderModalOpened}
          onClose={() => setNewFolderModalOpened(false)}
          onCreateFolder={handleCreateFolder}
        />

        <RenameModal
          opened={renameModalOpened}
          onClose={() => setRenameModalOpened(false)}
          initialName={selectedItem?.name || ""}
          onRename={handleRename}
        />

        <DeleteModal
          opened={deleteModalOpened}
          onClose={() => setDeleteModalOpened(false)}
          item={itemToDelete}
          onDelete={handleDelete}
        />

        {/* Context Menu */}
        <ContextMenu
          contextMenu={contextMenu}
          onDownload={handleDownload}
          onRename={(item) => {
            setSelectedItem(item);
            setRenameModalOpened(true);
          }}
          onDelete={confirmDelete}
          onClose={() => setContextMenu(null)}
        />
      </AppShell.Main>
    </AppShell>
  );
}
