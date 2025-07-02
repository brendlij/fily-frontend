"use client";

import { Anchor, Breadcrumbs, Button, Group, Tooltip } from "@mantine/core";
import { IconFolder, IconHome } from "@tabler/icons-react";
import { useTheme } from "../../contexts/ThemeContext";

interface FileBreadcrumbsProps {
  currentPath: string;
  onNavigateUp: () => void;
  onNavigateTo: (path: string, direction: "forward" | "backward") => void;
}

export function FileBreadcrumbs({
  currentPath,
  onNavigateUp,
  onNavigateTo,
}: FileBreadcrumbsProps) {
  const { t } = useTheme();
  const pathSegments = currentPath.split("/").filter(Boolean);

  return (
    <Group className="animate-fade-in">
      {currentPath && (
        <Tooltip label={t("oneStepBack")} position="bottom">
          <Button
            variant="light"
            size="sm"
            onClick={onNavigateUp}
            leftSection={<IconFolder size={14} />}
            style={{
              transition: "all 0.2s ease",
            }}
            className="hover-lift"
          >
            {t("back")}
          </Button>
        </Tooltip>
      )}
      <Breadcrumbs separator="›">
        <Anchor
          onClick={() => onNavigateTo("", "backward")}
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
              const targetPath = pathSegments.slice(0, index + 1).join("/");
              const isGoingBack = targetPath.length < currentPath.length;
              onNavigateTo(targetPath, isGoingBack ? "backward" : "forward");
            }}
            style={{ transition: "all 0.2s ease" }}
            className="hover-scale"
          >
            {segment}
          </Anchor>
        ))}
      </Breadcrumbs>
    </Group>
  );
}
