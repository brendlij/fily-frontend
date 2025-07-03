"use client";

import { useState, useMemo, useEffect } from "react";
import { Grid, LoadingOverlay, Transition } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { FileItem } from "./types";
import { FileCard } from "./FileCard";
import { FileModal } from "./FileModal";
import { SearchBar } from "./SearchBar";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useDragAndDrop, DragState } from "@/hooks/useDragAndDrop";
import { FlyingFile } from "./FlyingFile";
import Fuse from "fuse.js";
import { KEYWORD_EXTENSION_MAP } from "@/lib/extensionKeywords";
import api from "@/lib/api";

// Import der CSS für Drag & Drop
import "@/styles/dragdrop.css";

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
  onRefresh?: () => void; // Zum Neuladen der Dateien nach Drag & Drop
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
  onRefresh,
}: FileGridProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<{
    url: string;
    type: "image" | "pdf" | "text" | "json" | "markdown" | "video" | null;
    text?: string;
    name?: string;
  } | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  // Lokaler State zum Verfolgen von verschobenen Dateien
  const [movedFilePaths, setMovedFilePaths] = useState<Set<string>>(new Set());
  const fuzzySearchEnabled = useSettingsStore((s) => s.fuzzySearchEnabled);

  // Während der Animation die Datei vorübergehend aus dem UI entfernen
  const removeMovedFileFromUI = (filePath: string) => {
    // Einfach den Pfad zur Liste der zu filternden Dateien hinzufügen
    setMovedFilePaths(prev => {
      const newSet = new Set(prev);
      newSet.add(filePath);
      console.log(`Datei während der Animation ausblenden: ${filePath}`);
      return newSet;
    });
  };

  // Drag & Drop Funktionalität
  const {
    dragState,
    handleDragStart,
    handleDragOver,
    startAnimation,
    endAnimation,
  } = useDragAndDrop();

  // Handler für das Ablegen einer Datei
  const handleDrop = async (e: React.DragEvent, targetItem: FileItem) => {
    e.preventDefault();

    if (!dragState.draggedItem || targetItem.type !== "directory") {
      return;
    }

    // Element-Referenzen für die Animation finden
    const sourceElements = document.querySelectorAll(
      `[data-file-id="${dragState.draggedItem.path}"]`
    );
    const targetElements = document.querySelectorAll(
      `[data-file-id="${targetItem.path}"]`
    );

    if (sourceElements.length === 0 || targetElements.length === 0) {
      console.error("Element für Animation nicht gefunden");
      return;
    }

    const sourceRect = sourceElements[0].getBoundingClientRect();
    const targetRect = targetElements[0].getBoundingClientRect();

    // Animation starten, bevor die Datei verschoben wird
    startAnimation(sourceRect, targetRect, dragState.draggedItem);
    
    // Aktiv die Datei aus dem UI entfernen - dies muss vor der API-Anfrage geschehen
    const movedItemPath = dragState.draggedItem.path;
    console.log(`Entferne Datei ${movedItemPath} aus der Ansicht`);
    removeMovedFileFromUI(movedItemPath);

    // Pfade für Quelle und Ziel erstellen
    const sourcePath = dragState.draggedItem.path;
    const targetPath = `${targetItem.path}/${dragState.draggedItem.name}`;

    try {
      // API-Aufruf zum Verschieben der Datei
      await api.moveFile(sourcePath, targetPath);
      
      // SOFORT nach erfolgreichem API-Call die Dateiliste neu laden
      // Dies ist der wichtigste Teil: Garantiert frische Daten vom Server holen
      if (onRefresh) {
        console.log("Sofort nach API-Call die Dateiliste neu laden");
        onRefresh();
      }

      // Erfolg anzeigen
      notifications.show({
        title: "Datei verschoben",
        message: `${dragState.draggedItem.name} wurde nach ${targetItem.name} verschoben`,
        color: "green",
      });
      
      // Die Animation läuft weiter
      setTimeout(() => {
        // Animation beenden
        endAnimation();
        
        // WICHTIG: Nach Ende der Animation immer die Dateiliste neu laden
        // Erzwinge einen frischen API-Call ohne Caching
        if (onRefresh) {
          console.log("Refresh nach Animation - garantiert frische Daten laden");
          
          // Keine komplizierte Logik mehr mit lokalen Listen oder Filter-Arrays
          // Stattdessen direkt die Dateiliste vom Server neu laden
          onRefresh();
          
          // Wichtig: Sofort die movedFilePaths zurücksetzen,
          // damit der nächste API-Call mit frischen Daten arbeitet
          setMovedFilePaths(new Set());
        }
      }, 700); // Animation dauert 600ms, warte etwas länger
    } catch (error) {
      notifications.show({
        title: "Fehler",
        message: `Beim Verschieben der Datei ist ein Fehler aufgetreten: ${
          error instanceof Error ? error.message : "Unbekannter Fehler"
        }`,
        color: "red",
      });

      // Bei Fehler Animation beenden
      endAnimation();
    }
  };

  // Überwache Änderungen in files und movedFilePaths
  useEffect(() => {
    console.log("Files oder movedFilePaths haben sich geändert:", 
                { filesCount: files.length, movedCount: movedFilePaths.size });
  }, [files, movedFilePaths]);

  // Bei Pfadwechsel stellen wir sicher, dass keine alten verschobenen Dateien im State bleiben
  useEffect(() => {
    // Nur zur Sicherheit - wenn der Pfad sich ändert, setzen wir den movedFilePaths-State zurück
    setMovedFilePaths(new Set());
  }, [currentPath]);

  // Während der Animation die verschobene Datei aus der Anzeige filtern
  // Das ist nur für die optische Darstellung während der Animation wichtig
  // Die tatsächliche Dateiliste wird durch den API-Refresh aktualisiert
  const baseFiles = files.filter(item => !movedFilePaths.has(item.path));
  
  // Fuse wird nur neu gebaut, wenn baseFiles sich ändern (Performance!)
  const fuse = useMemo(
    () =>
      new Fuse(baseFiles, {
        keys: ["name"],
        threshold: 0.4,
        ignoreLocation: true,
      }),
    [baseFiles, files, movedFilePaths]
  );

  // --- Filter mit Keyword-Map und Fuzzy Toggle ---
  const searchLower = searchTerm.trim().toLowerCase();
  let filteredFiles: FileItem[] = baseFiles;

  if (searchLower) {
    if (fuzzySearchEnabled) {
      // Extension-Boost: Keywords wie "typescript" oder "image"
      let extensionHit = false;
      for (const [keyword, extensions] of Object.entries(
        KEYWORD_EXTENSION_MAP
      )) {
        if (searchLower.includes(keyword)) {
          filteredFiles = baseFiles.filter((item) =>
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
        filteredFiles = fuse.search(searchLower)
          .map((result) => result.item)
          .filter(item => !movedFilePaths.has(item.path));
      }
    } else {
      // Klassisch: Nur echter String-Match auf Name/Extension/Keyword
      filteredFiles = baseFiles.filter((item) => {
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

  // Debug-Logging, um zu sehen, wann die Dateiliste aktualisiert wird
  useEffect(() => {
    if (movedFilePaths.size > 0) {
      console.log("Dateien werden gefiltert während der Animation:", Array.from(movedFilePaths));
    }
  }, [files, movedFilePaths]);

  return (
    <>
      {/* Fliegende Datei Animation */}
      {dragState.animation && dragState.draggedItem && (
        <FlyingFile
          item={dragState.draggedItem}
          startX={dragState.animation.startX}
          startY={dragState.animation.startY}
          targetX={dragState.animation.targetX}
          targetY={dragState.animation.targetY}
          // Wir benutzen jetzt das setTimeout in handleDrop für die Animation
          onAnimationComplete={() => {
            console.log("Animation complete callback");
          }}
        />
      )}

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
            <Grid className="file-grid">
              {filteredFiles.map((item, index) => (
                <Grid.Col
                  key={`${currentPath}-${item.name}-${index}`}
                  span={{ base: 6, sm: 4, md: 3, lg: 3 }}
                >
                  <FileCard
                    item={item}
                    data-file-id={item.path} // Für die Animation
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
                    // Drag & Drop Props
                    isDragging={false} // Nie ausgegraut anzeigen
                    isDropTarget={dragState.dropTarget?.name === item.name}
                    onDragStart={(e) => handleDragStart(item)}
                    onDragOver={(e) => handleDragOver(item, e)}
                    onDrop={(e) => handleDrop(e, item)}
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
