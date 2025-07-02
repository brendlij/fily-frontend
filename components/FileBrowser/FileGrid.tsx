"use client";

import { useState } from "react";
import { Grid, LoadingOverlay, Transition } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { FileItem } from "./types";
import { FileCard } from "./FileCard";
import { FileModal } from "./FileModal"; // importieren

interface FileGridProps {
  files: FileItem[];
  currentPath: string;
  loading: boolean;
  isNavigating: boolean;
  navigationDirection: "forward" | "backward" | "none";
  onDownload: (item: FileItem) => void;
  onRename: (item: FileItem) => void;
  onDelete: (item: FileItem) => void;
  onContextMenu: (e: React.MouseEvent, item: FileItem) => void;
  formatFileSize: (bytes: number) => string;
  setCurrentPath: (path: string) => void;
}

export function FileGrid({
  files,
  currentPath,
  loading,
  isNavigating,
  navigationDirection,
  onDownload,
  onRename,
  onDelete,
  onContextMenu,
  formatFileSize,
  setCurrentPath,
}: FileGridProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<{
    url: string;
    type: "image" | "pdf" | "text" | "json" | "markdown" | null;
    text?: string;
    name?: string;
  } | null>(null);

  const openFileModal = async (item: FileItem) => {
    const ext = item.name.split(".").pop()?.toLowerCase() || "";
    const url = `/api/files/view?path=${encodeURIComponent(item.path)}`;
    const token = localStorage.getItem("auth_token");

    // Helper: Fetch as blob, return URL
    const fetchBlobUrl = async () => {
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Fehler beim Laden der Datei");
      const blob = await res.blob();
      return URL.createObjectURL(blob);
    };

    try {
      if (["png", "jpg", "jpeg", "gif", "bmp", "svg"].includes(ext)) {
        const objectUrl = await fetchBlobUrl();
        setModalContent({ url: objectUrl, type: "image", name: item.name });
        setModalOpen(true);
      } else if (ext === "pdf") {
        const objectUrl = await fetchBlobUrl();
        setModalContent({ url: objectUrl, type: "pdf", name: item.name });
        setModalOpen(true);
      } else if (ext === "json") {
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const text = await res.text();
        setModalContent({ url: "", type: "json", text, name: item.name });
        setModalOpen(true);
      } else if (ext === "md") {
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const text = await res.text();
        setModalContent({ url: "", type: "markdown", text, name: item.name });
        setModalOpen(true);
      } else if (["txt", "csv", "log", "js", "ts"].includes(ext)) {
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const text = await res.text();
        setModalContent({ url: "", type: "text", text, name: item.name });
        setModalOpen(true);
      } else {
        notifications.show({
          title: "Fehler",
          message: "Dateityp wird nicht unterstützt",
          color: "red",
          position: "bottom-right",
        });
      }
    } catch (err) {
      notifications.show({
        title: "Fehler",
        message: "Fehler beim Laden der Datei",
        color: "red",
        position: "bottom-right",
      });
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalContent(null);
  };

  return (
    <>
      <Transition
        mounted={!loading && !isNavigating}
        transition={{
          in: {
            opacity: 1,
            transform: "translateX(0)",
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
                  <FileCard
                    item={item}
                    onItemClick={() => {
                      if (item.type === "directory") {
                        setCurrentPath(
                          currentPath
                            ? `${currentPath}/${item.name}`
                            : item.name
                        );
                      } else {
                        openFileModal(item);
                      }
                    }}
                    onDownload={onDownload}
                    onRename={onRename}
                    onDelete={onDelete}
                    onContextMenu={onContextMenu}
                    formatFileSize={formatFileSize}
                  />
                </Grid.Col>
              ))}
            </Grid>
          </div>
        )}
      </Transition>

      <FileModal
        opened={modalOpen}
        onClose={closeModal}
        content={modalContent}
      />
    </>
  );
}
