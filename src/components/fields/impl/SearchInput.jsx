import { Input } from "components/ui/input";
import { Search } from "lucide-react";
import React from "react";
import { useLocale } from "../../../utils/Language";
import { cn } from "lib/utils";

export default function SearchInput({ value, onSearch, onChange, groupStyle, className, ...props }) {
  const locale = useLocale();

  return (
    <div className={cn("relative", className)} style={groupStyle}>
      <div
        className={cn(
          "absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center",
          onSearch ? "cursor-pointer" : "cursor-default"
        )}
        role="button"
        tabIndex={-1}
        aria-label="Search"
        onClick={onSearch}
      >
        <Search className="h-3.75 w-3.75 text-(--text-muted)" />
      </div>
      <Input
        className="pl-9 pr-16 rounded-full bg-(--surface-secondary) text-(--text-primary) text-sm font-medium"
        placeholder={locale({ zh: "搜索...", en: "Search" })}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        {...props}
      />
      <div className="absolute right-3 top-1/2 -translate-y-1/2">
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-(--border-default) bg-(--surface-secondary) px-1.5 text-[10px] font-medium text-(--text-muted)">
          Ctrl+K
        </kbd>
      </div>
    </div>
  );
}
