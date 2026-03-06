import { cn } from "lib/utils";
import { PAGE_PT } from "utils/layout-tokens";

const MAX_WIDTHS = {
  default: "max-w-7xl",
  narrow: "max-w-5xl",
  full: "max-w-none",
};

export default function PageContainer({
  children,
  className,
  withTopPadding = true,
  size = "default",
}) {
  return (
    <div
      className={cn("mx-auto w-full space-y-6 md:space-y-8", MAX_WIDTHS[size] || MAX_WIDTHS.default, className)}
      style={withTopPadding ? { paddingTop: `var(--page-top-offset, ${PAGE_PT})` } : undefined}
    >
      {children}
    </div>
  );
}
