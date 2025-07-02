// Shared types for FileBrowser components
export interface FileItem {
  name: string;
  type: "file" | "directory";
  size?: number;
  modified?: string;
  path: string; // relativer Pfad zur Datei
}

export interface ContextMenuType {
  x: number;
  y: number;
  item: FileItem | null;
}

// Sorting options
export type SortByType = "name" | "type" | "modified" | "size";
export type SortDirType = "asc" | "desc";

// Props for components
export interface FileHeaderProps {
  onLogout: () => void;
  onRefresh: () => void;
}

export interface FileToolbarProps {
  sortBy: SortByType;
  sortDir: SortDirType;
  setSortBy: (val: SortByType) => void;
  setSortDir: (val: SortDirType) => void;
}

export interface FileBreadcrumbsProps {
  currentPath: string;
  pathSegments: string[];
  navigateToPath: (path: string, direction: "forward" | "backward") => void;
  navigateUp: () => void;
}

export interface FileGridProps {
  files: FileItem[];
  currentPath: string;
  loading: boolean;
  isNavigating: boolean;
  navigationDirection: "forward" | "backward" | "none";
  handleItemClick: (item: FileItem) => void;
  handleContextMenu: (e: React.MouseEvent, item: FileItem) => void;
  handleRightClick: (e: React.MouseEvent, item: FileItem) => void;
  formatFileSize: (bytes: number) => string;
}

export interface FileCardProps {
  item: FileItem;
  onClick: () => void;
  onContextMenu: (e: React.MouseEvent) => void;
  formatFileSize: (bytes: number) => string;
}

export interface SortControlsProps {
  sortBy: SortByType;
  sortDir: SortDirType;
  setSortBy: (val: SortByType) => void;
  setSortDir: (val: SortDirType) => void;
}

export interface UploadModalProps {
  opened: boolean;
  onClose: () => void;
  onUpload: (files: any[]) => void;
  isUploading: boolean;
  uploadProgress: number;
  currentUploadFile: string;
}

// Common props for modals
export interface ModalBaseProps {
  opened: boolean;
  onClose: () => void;
}

export interface RenameModalProps extends ModalBaseProps {
  initialName: string;
  onRename: (newName: string) => void;
}

export interface DeleteModalProps extends ModalBaseProps {
  item: FileItem | null;
  onDelete: () => void;
}

export interface NewFolderModalProps extends ModalBaseProps {
  onCreateFolder: (name: string) => void;
}
