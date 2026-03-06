import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "components/ui/select";
import { cn } from "lib/utils";
import React, { useState } from "react";
import { Badge } from "components/ui/badge";
import { X } from "lucide-react";

function normalizeOptionLabel(label, fallbackValue) {
  if (React.isValidElement(label) || typeof label === "string" || typeof label === "number") {
    return label;
  }

  if (label && typeof label === "object") {
    if ("label" in label) {
      return normalizeOptionLabel(label.label, fallbackValue);
    }

    if ("en" in label || "zh" in label) {
      return label.en || label.zh || String(fallbackValue ?? "");
    }

    if ("name" in label) {
      return normalizeOptionLabel(label.name, fallbackValue);
    }

    if ("value" in label && (typeof label.value === "string" || typeof label.value === "number")) {
      return String(label.value);
    }
  }

  return String(fallbackValue ?? "");
}

function normalizeOption(opt) {
  if (typeof opt === "string" || typeof opt === "number") {
    return {
      value: String(opt),
      label: String(opt),
    };
  }

  if (!opt || typeof opt !== "object") {
    return {
      value: String(opt ?? ""),
      label: String(opt ?? ""),
    };
  }

  const rawValue = opt.value ?? opt.id ?? opt.key ?? opt.label ?? opt.name ?? "";

  return {
    ...opt,
    value: String(rawValue),
    label: normalizeOptionLabel(opt.label ?? opt.name ?? rawValue, rawValue),
  };
}

export function SelectField({ value, onChange, options, isMulti, placeholder, error, ...props }) {
  const data = Array.isArray(options)
    ? options.map(normalizeOption)
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
        <SelectTrigger className={cn(error && "border-(--status-error)")}>
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
        <p className="text-xs text-(--status-error) mt-1">{error}</p>
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
          "flex min-h-9 w-full flex-wrap items-center gap-1.5 rounded-(--radius-md) border border-(--border-default) bg-(--surface-primary) px-3 py-1.5 text-sm shadow-(--shadow-xs) cursor-pointer",
          error && "border-(--status-error)"
        )}
        onClick={() => setOpen(!open)}
      >
        {selected.length === 0 && (
          <span className="text-(--text-muted)">{placeholder || "Select items"}</span>
        )}
        {selected.map((val) => {
          const item = data.find((d) => d.value === val);
          return (
            <Badge key={val} variant="secondary" className="gap-1 pr-1">
              {item?.label || val}
              <button
                type="button"
                className="ml-0.5 rounded-full hover:bg-(--surface-secondary) p-0.5"
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
        <div className="mt-1 max-h-60 overflow-auto rounded-(--radius-md) border border-(--border-default) bg-(--surface-card) p-1 shadow-(--shadow-lg) z-50">
          {data.map((item) => (
            <button
              key={item.value}
              type="button"
              className={cn(
                "flex w-full items-center rounded-(--radius-sm) px-2 py-1.5 text-sm text-(--text-primary) hover:bg-(--surface-secondary) cursor-pointer",
                selected.includes(item.value) && "bg-(--surface-secondary) font-medium"
              )}
              onClick={() => toggleItem(item.value)}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
      {error && (
        <p className="text-xs text-(--status-error) mt-1">{error}</p>
      )}
    </div>
  );
}
