import { cn } from "lib/utils";
import { PAGE_PT } from "utils/layout-tokens";

const MAX_WIDTHS = {
  default: "max-w-[1440px]",
  narrow: "max-w-[1180px]",
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
      className={cn("mx-auto w-full space-y-7 px-0.5 md:space-y-9", MAX_WIDTHS[size] || MAX_WIDTHS.default, className)}
      style={withTopPadding ? { paddingTop: `var(--page-top-offset, ${PAGE_PT})` } : undefined}
    >
      {children}
    </div>
  );
}
