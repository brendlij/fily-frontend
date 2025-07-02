"use client";

import { useState, useMemo } from "react";
import { Grid, LoadingOverlay, Transition } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { FileItem } from "./types";
import { FileCard } from "./FileCard";
import { FileModal } from "./FileModal";
import { SearchBar } from "./SearchBar";
import { useSettingsStore } from "@/store/useSettingsStore";
import Fuse from "fuse.js";
import { KEYWORD_EXTENSION_MAP } from "@/lib/extensionKeywords";

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
    type: "image" | "pdf" | "text" | "json" | "markdown" | "video" | null;
    text?: string;
    name?: string;
  } | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const fuzzySearchEnabled = useSettingsStore((s) => s.fuzzySearchEnabled);

  // Fuse wird nur neu gebaut, wenn files sich ändern (Performance!)
  const fuse = useMemo(
    () =>
      new Fuse(files, {
        keys: ["name"],
        threshold: 0.4,
        ignoreLocation: true,
      }),
    [files]
  );

  // --- Filter mit Keyword-Map und Fuzzy Toggle ---
  const searchLower = searchTerm.trim().toLowerCase();

  let filteredFiles: FileItem[] = files;

  if (searchLower) {
    if (fuzzySearchEnabled) {
      // Extension-Boost: Keywords wie "typescript" oder "image"
      let extensionHit = false;
      for (const [keyword, extensions] of Object.entries(
        KEYWORD_EXTENSION_MAP
      )) {
        if (searchLower.includes(keyword)) {
          filteredFiles = files.filter((item) =>
            extensions.some((ext) =>
              item.name.toLowerCase().endsWith(`.${ext}`)
            )
          );
          extensionHit = true;
          break;
        }
      }
      // Wenn kein Keyword-Match, dann fuzzy
      if (!extensionHit) {
        filteredFiles = fuse.search(searchLower).map((result) => result.item);
      }
    } else {
      // Klassisch: Nur echter String-Match auf Name/Extension/Keyword
      filteredFiles = files.filter((item) => {
        const name = item.name.toLowerCase();
        if (name.includes(searchLower)) return true;
        for (const [keyword, extensions] of Object.entries(
          KEYWORD_EXTENSION_MAP
        )) {
          if (searchLower.includes(keyword)) {
            return extensions.some((ext) => name.endsWith(`.${ext}`));
          }
        }
        return false;
      });
    }
  }

  // Modal-Handler und FileViewer bleibt wie gehabt (abgekürzt)
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
      } else if (["mp4", "avi", "mov", "webm"].includes(ext)) {
        const objectUrl = await fetchBlobUrl();
        setModalContent({ url: objectUrl, type: "video", name: item.name });
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
      <SearchBar
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="Nach Datei, Typ, Extension suchen..."
      />

      <Transition
        mounted={!loading && !isNavigating}
        transition={{
          in: { opacity: 1, transform: "translateX(0)" },
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
              {filteredFiles.map((item, index) => (
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
