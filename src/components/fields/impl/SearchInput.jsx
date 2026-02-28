import { ActionIcon, Kbd, TextInput } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import React from "react";
import { useLocale } from "../../../utils/Language";

export default function SearchInput({ value, onSearch, onChange, groupStyle, ...props }) {
  const locale = useLocale();

  return (
    <TextInput
      leftSection={
        <ActionIcon
          variant="transparent"
          aria-label="Search"
          onClick={onSearch}
          style={{ cursor: onSearch ? "pointer" : "default" }}
        >
          <IconSearch size={15} />
        </ActionIcon>
      }
      rightSection={<Kbd size="xs">Ctrl+K</Kbd>}
      fz="sm"
      fw={500}
      radius="xl"
      placeholder={locale({ zh: "搜索...", en: "Search" })}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      styles={{
        input: {
          background: "var(--surface-secondary)",
          color: "var(--text-primary)",
        },
      }}
      style={groupStyle}
      {...props}
    />
  );
}