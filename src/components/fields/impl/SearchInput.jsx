import { ActionIcon, TextInput } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import React from "react";
import { useLocale } from "../../../utils/Language";
import { useTextColor, useColorValue } from "../../../utils/colors";

export default function SearchInput({ value, onSearch, onChange, groupStyle, ...props }) {
  const locale = useLocale();
  const inputBg = useColorValue("var(--mantine-color-gray-1)", "var(--mantine-color-dark-8)");
  const inputText = useTextColor();

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
      fz="sm"
      fw={500}
      radius="xl"
      placeholder={locale({ zh: "搜索...", en: "Search" })}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      styles={{
        input: {
          background: inputBg,
          color: inputText,
        },
      }}
      style={groupStyle}
      {...props}
    />
  );
}