import { useState } from "react";
import { FileItem } from "@/components/FileBrowser/types";

export interface DragState {
  isDragging: boolean;
  draggedItem: FileItem | null;
  dropTarget: FileItem | null;
  animation: {
    active: boolean;
    startX: number;
    startY: number;
    targetX: number;
    targetY: number;
  } | null;
}

export function useDragAndDrop() {
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    draggedItem: null,
    dropTarget: null,
    animation: null,
  });

  const handleDragStart = (item: FileItem) => {
    if (item.type === "directory") {
      // Ordner selbst können nicht verschoben werden
      return;
    }

    setDragState({
      isDragging: true,
      draggedItem: item,
      dropTarget: null,
      animation: null,
    });
  };

  const handleDragOver = (
    targetItem: FileItem | null,
    event: React.DragEvent
  ) => {
    event.preventDefault();

    // Nur Ordner können Ziele sein
    if (targetItem && targetItem.type === "directory") {
      setDragState((prev) => ({
        ...prev,
        dropTarget: targetItem,
      }));
    }
  };

  const handleDragEnd = () => {
    setDragState({
      isDragging: false,
      draggedItem: null,
      dropTarget: null,
      animation: null,
    });
  };

  // Neue Methode für Animation starten
  const startAnimation = (
    sourceRect: DOMRect,
    targetRect: DOMRect,
    item: FileItem
  ) => {
    // Berechne die Start- und Zielkoordinaten
    const startX = sourceRect.left + sourceRect.width / 2 - 40; // Zentriere die 80px breite Karte
    const startY = sourceRect.top + sourceRect.height / 2 - 40; // Zentriere die 80px hohe Karte
    const targetX = targetRect.left + targetRect.width / 2 - 40;
    const targetY = targetRect.top + targetRect.height / 2 - 40;

    // Beim Starten der Animation sofort den dropTarget zurücksetzen,
    // damit der grüne Rahmen verschwindet
    setDragState((prev) => ({
      ...prev,
      dropTarget: null,
      animation: {
        active: true,
        startX,
        startY,
        targetX,
        targetY,
      },
    }));
  };

  // Animation beenden
  const endAnimation = () => {
    setDragState({
      isDragging: false,
      draggedItem: null,
      dropTarget: null,
      animation: null,
    });
  };

  return {
    dragState,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    startAnimation,
    endAnimation,
  };
}
