import { cn } from "lib/utils";

function SegmentedControl({ value, onChange, onValueChange, data, items: itemsProp, className, size = "sm" }) {
  const resolvedData = data || itemsProp || [];
  const resolvedOnChange = onChange || onValueChange;

  const items = resolvedData.map((item) =>
    typeof item === "string" ? { value: item, label: item } : item
  );

  const sizes = {
    xs: "h-7 text-xs px-2",
    sm: "h-8 text-sm px-3",
    md: "h-9 text-sm px-4",
  };

  return (
    <div className={cn("inline-flex items-center rounded-md bg-(--surface-secondary) p-1", className)}>
      {items.map((item) => (
        <button
          key={item.value}
          type="button"
          onClick={() => resolvedOnChange(item.value)}
          className={cn(
            "relative inline-flex items-center justify-center whitespace-nowrap rounded-sm font-medium transition-all duration-150 cursor-pointer",
            sizes[size],
            value === item.value
              ? "bg-(--surface-primary) text-(--text-primary) shadow-(--shadow-xs)"
              : "text-(--text-muted) hover:text-(--text-secondary)"
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

export { SegmentedControl };
