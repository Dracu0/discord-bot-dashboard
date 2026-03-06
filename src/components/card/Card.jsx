import { Slot } from "@radix-ui/react-slot";
import { Card as ShadcnCard } from "components/ui/card";
import { cn } from "lib/utils";

const CARD_VARIANTS = {
  default: "rounded-3xl border border-(--border-subtle) bg-(--surface-card) p-5 shadow-(--shadow-sm)",
  compact: "rounded-2xl border border-(--border-subtle) bg-(--surface-card) p-4 shadow-(--shadow-xs)",
  panel: "rounded-[30px] border border-(--border-subtle) bg-[linear-gradient(180deg,var(--surface-card)_0%,var(--surface-primary)_100%)] p-5 shadow-(--shadow-md) md:p-6",
  flush: "overflow-hidden rounded-[30px] border border-(--border-subtle) bg-(--surface-card) p-0 shadow-(--shadow-sm)",
  bare: "rounded-3xl border border-(--border-subtle) bg-transparent",
  interactive: "rounded-3xl border border-(--border-subtle) bg-(--surface-card) p-5 shadow-(--shadow-sm) transition-all duration-200 hover:-translate-y-0.5 hover:border-(--border-default) hover:shadow-(--shadow-md)",
};

function Card({ children, className, variant = "default", asChild = false, ...rest }) {
  const Comp = asChild ? Slot : ShadcnCard;

  return (
    <Comp
      className={cn(CARD_VARIANTS[variant] || CARD_VARIANTS.default, className)}
      {...rest}
    >
      {children}
    </Comp>
  );
}

export default Card;
