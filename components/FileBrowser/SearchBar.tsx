"use client";

import { TextInput } from "@mantine/core";
import { FC } from "react";
import { IconSearch } from "@tabler/icons-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const SearchBar: FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder,
}) => (
  <TextInput
    placeholder={placeholder ?? "Dateien suchen..."}
    value={value}
    onChange={(e) => onChange(e.currentTarget.value)}
    mb="md"
    leftSection={<IconSearch size={16} stroke={1.5} color="#bbb" />}
    autoFocus
  />
);
