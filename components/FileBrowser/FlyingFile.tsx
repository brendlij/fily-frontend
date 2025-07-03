"use client";

import { useEffect, useState } from "react";
import { Card, Image } from "@mantine/core";
import { FileItem } from "./types";
import {
  IconFile,
  IconFileTypePdf,
  IconFileTypeJpg,
  IconFileTypePng,
  IconFileTypeDoc,
} from "@tabler/icons-react";

interface FlyingFileProps {
  item: FileItem;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  onAnimationComplete: () => void;
}

export function FlyingFile({
  item,
  startX,
  startY,
  targetX,
  targetY,
  onAnimationComplete,
}: FlyingFileProps) {
  const [visible, setVisible] = useState(true);

  // Berechne die Flugrichtung
  const flyX = targetX - startX;
  const flyY = targetY - startY;

  useEffect(() => {
    // Nach Animation aufräumen
    const timer = setTimeout(() => {
      setVisible(false);
      onAnimationComplete();
    }, 600); // Match animation duration

    return () => clearTimeout(timer);
  }, [onAnimationComplete]);

  if (!visible) return null;

  // Einfachen Dateityp basierend auf der Erweiterung ermitteln
  const ext = item.name.split(".").pop()?.toLowerCase() || "";

  let FileIcon = IconFile;

  if (ext === "pdf") FileIcon = IconFileTypePdf;
  else if (["jpg", "jpeg", "png", "gif"].includes(ext))
    FileIcon = ext === "png" ? IconFileTypePng : IconFileTypeJpg;
  else if (["doc", "docx"].includes(ext)) FileIcon = IconFileTypeDoc;

  return (
    <div
      className="file-flying"
      style={
        {
          left: startX,
          top: startY,
          "--fly-x": `${flyX}px`,
          "--fly-y": `${flyY}px`,
        } as React.CSSProperties
      }
    >
      <Card
        p="xs"
        style={{
          width: 80,
          height: 80,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          opacity: 0.9,
        }}
      >
        <FileIcon size={32} />
        <div
          style={{
            fontSize: "10px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            maxWidth: "70px",
            textAlign: "center",
          }}
        >
          {item.name}
        </div>
      </Card>
    </div>
  );
}
