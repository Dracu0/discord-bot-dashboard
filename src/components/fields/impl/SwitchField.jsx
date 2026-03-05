import { Switch } from "components/ui/switch";
import { cn } from "lib/utils";
import React from "react";

export default function Default(props) {
  const { id, label, isChecked, onChange, reversed, className, ...rest } = props;

  return (
    <div className={cn("w-full font-medium", className)} {...rest}>
      <div
        className={cn(
          "flex items-center gap-4",
          reversed ? "flex-row-reverse justify-start" : "flex-row justify-between"
        )}
      >
        <label htmlFor={id} className="cursor-pointer max-w-[75%] mb-0">
          <span
            className={cn(
              "text-start text-base font-medium transition-colors duration-200",
              isChecked ? "text-[var(--accent-primary)]" : "text-[var(--text-primary)]"
            )}
          >
            {label}
          </span>
        </label>
        <Switch
          checked={isChecked}
          id={id}
          onCheckedChange={(checked) => {
            if (onChange) {
              onChange({ target: { checked } });
            }
          }}
        />
      </div>
    </div>
  );
}
