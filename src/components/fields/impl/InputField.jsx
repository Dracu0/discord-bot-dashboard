import { Input } from "components/ui/input";
import { cn } from "lib/utils";

export function InputField({ error, className, ...props }) {
  return (
    <div className="w-full">
      <Input
        className={cn(
          "font-medium",
          error && "border-[var(--status-error)]",
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-xs text-[var(--status-error)] mt-1">{error}</p>
      )}
    </div>
  );
}
