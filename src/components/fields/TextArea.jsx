import { Textarea } from "components/ui/textarea";
import { cn } from "lib/utils";

export default function TextArea({ error, className, ...props }) {
  return (
    <div>
      <Textarea
        placeholder="Enter text"
        rows={3}
        className={cn(
          "min-h-[80px] resize-y",
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
