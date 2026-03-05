import { cn } from "lib/utils";

function SegmentedControl({ value, onChange, data, className, size = "sm" }) {
  const items = data.map((item) =>
    typeof item === "string" ? { value: item, label: item } : item
  );

  const sizes = {
    xs: "h-7 text-xs px-2",
    sm: "h-8 text-sm px-3",
    md: "h-9 text-sm px-4",
  };

  return (
    <div className={cn("inline-flex items-center rounded-[var(--radius-md)] bg-[var(--surface-secondary)] p-1", className)}>
      {items.map((item) => (
        <button
          key={item.value}
          type="button"
          onClick={() => onChange(item.value)}
          className={cn(
            "relative inline-flex items-center justify-center whitespace-nowrap rounded-[var(--radius-sm)] font-medium transition-all duration-150 cursor-pointer",
            sizes[size],
            value === item.value
              ? "bg-[var(--surface-primary)] text-[var(--text-primary)] shadow-[var(--shadow-xs)]"
              : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

export { SegmentedControl };
