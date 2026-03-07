import { Textarea } from "components/ui/textarea";
import { cn } from "lib/utils";

export default function TextArea({ error, className, ...props }) {
  return (
    <div>
      <Textarea
        placeholder="Enter text"
        rows={3}
        className={cn(
          "min-h-20 resize-y",
          error && "border-(--status-error)",
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-xs text-(--status-error) mt-1">{error}</p>
      )}
    </div>
  );
}
