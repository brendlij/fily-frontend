"use client";

import { ActionIcon, Group, Select, Text } from "@mantine/core";
import { IconSortAscending, IconSortDescending } from "@tabler/icons-react";
import { useTheme } from "../../contexts/ThemeContext";

type SortByType = "name" | "type" | "modified" | "size";
type SortDirType = "asc" | "desc";

interface SortControlsProps {
  sortBy: SortByType;
  sortDir: SortDirType;
  onSortByChange: (value: SortByType) => void;
  onSortDirChange: (value: SortDirType) => void;
}

export function SortControls({
  sortBy,
  sortDir,
  onSortByChange,
  onSortDirChange,
}: SortControlsProps) {
  const { t } = useTheme();

  return (
    <Group justify="flex-end" align="center" gap="xs">
      <Text size="sm" c="dimmed">
        {t("sortBy")}:
      </Text>
      <Select
        value={sortBy}
        onChange={(value) => onSortByChange(value as SortByType)}
        data={[
          { value: "name", label: t("sortName") },
          { value: "type", label: t("sortType") },
          { value: "modified", label: t("sortModified") },
          { value: "size", label: t("sortSize") },
        ]}
        size="sm"
        radius="md"
        w={160}
      />
      <ActionIcon
        variant="light"
        color="primary"
        size="md"
        radius="md"
        onClick={() => onSortDirChange(sortDir === "asc" ? "desc" : "asc")}
        title={sortDir === "asc" ? t("sortAscending") : t("sortDescending")}
      >
        {sortDir === "asc" ? (
          <IconSortAscending size={18} />
        ) : (
          <IconSortDescending size={18} />
        )}
      </ActionIcon>
    </Group>
  );
}
