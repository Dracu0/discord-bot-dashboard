import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "components/ui/select";
import { cn } from "lib/utils";
import { useState } from "react";
import { Badge } from "components/ui/badge";
import { X } from "lucide-react";

export function SelectField({ value, onChange, options, isMulti, placeholder, error, ...props }) {
  const data = Array.isArray(options)
    ? options.map((opt) => ({
        value: String(opt.value),
        label: opt.label || String(opt.value),
      }))
    : [];

  if (isMulti) {
    return (
      <MultiSelectField
        data={data}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        error={error}
      />
    );
  }

  return (
    <div>
      <Select
        value={value != null ? String(value) : undefined}
        onValueChange={(val) => onChange && onChange(val)}
      >
        <SelectTrigger className={cn(error && "border-[var(--status-error)]")}>
          <SelectValue placeholder={placeholder || "Select an item"} />
        </SelectTrigger>
        <SelectContent>
          {data.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && (
        <p className="text-xs text-[var(--status-error)] mt-1">{error}</p>
      )}
    </div>
  );
}

function MultiSelectField({ data, value, onChange, placeholder, error }) {
  const [open, setOpen] = useState(false);
  const selected = Array.isArray(value) ? value.map(String) : [];

  const toggleItem = (val) => {
    if (!onChange) return;
    if (selected.includes(val)) {
      onChange(selected.filter((v) => v !== val));
    } else {
      onChange([...selected, val]);
    }
  };

  const removeItem = (val) => {
    if (!onChange) return;
    onChange(selected.filter((v) => v !== val));
  };

  return (
    <div>
      <div
        className={cn(
          "flex min-h-9 w-full flex-wrap items-center gap-1.5 rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--surface-primary)] px-3 py-1.5 text-sm shadow-[var(--shadow-xs)] cursor-pointer",
          error && "border-[var(--status-error)]"
        )}
        onClick={() => setOpen(!open)}
      >
        {selected.length === 0 && (
          <span className="text-[var(--text-muted)]">{placeholder || "Select items"}</span>
        )}
        {selected.map((val) => {
          const item = data.find((d) => d.value === val);
          return (
            <Badge key={val} variant="secondary" className="gap-1 pr-1">
              {item?.label || val}
              <button
                type="button"
                className="ml-0.5 rounded-full hover:bg-[var(--surface-secondary)] p-0.5"
                onClick={(e) => {
                  e.stopPropagation();
                  removeItem(val);
                }}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          );
        })}
      </div>
      {open && (
        <div className="mt-1 max-h-60 overflow-auto rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--surface-card)] p-1 shadow-[var(--shadow-lg)] z-50">
          {data.map((item) => (
            <button
              key={item.value}
              type="button"
              className={cn(
                "flex w-full items-center rounded-[var(--radius-sm)] px-2 py-1.5 text-sm text-[var(--text-primary)] hover:bg-[var(--surface-secondary)] cursor-pointer",
                selected.includes(item.value) && "bg-[var(--surface-secondary)] font-medium"
              )}
              onClick={() => toggleItem(item.value)}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
      {error && (
        <p className="text-xs text-[var(--status-error)] mt-1">{error}</p>
      )}
    </div>
  );
}
