"use client";

import { Grid, LoadingOverlay, Transition } from "@mantine/core";
import { FileItem } from "./types";
import { FileCard } from "./FileCard";

interface FileGridProps {
  files: FileItem[];
  currentPath: string;
  loading: boolean;
  isNavigating: boolean;
  navigationDirection: "forward" | "backward" | "none";
  onItemClick: (item: FileItem) => void;
  onDownload: (item: FileItem) => void;
  onRename: (item: FileItem) => void;
  onDelete: (item: FileItem) => void;
  onContextMenu: (e: React.MouseEvent, item: FileItem) => void;
  formatFileSize: (bytes: number) => string;
}

export function FileGrid({
  files,
  currentPath,
  loading,
  isNavigating,
  navigationDirection,
  onItemClick,
  onDownload,
  onRename,
  onDelete,
  onContextMenu,
  formatFileSize,
}: FileGridProps) {
  return (
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
                <FileCard
                  item={item}
                  onItemClick={onItemClick}
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
  );
}
