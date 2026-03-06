import { Card as ShadcnCard } from "components/ui/card";
import { cn } from "lib/utils";

const CARD_VARIANTS = {
  default: "rounded-2xl border p-5",
  compact: "rounded-2xl border p-4",
  panel: "rounded-[28px] border p-5 shadow-(--shadow-sm) md:p-6",
  flush: "overflow-hidden rounded-[28px] border p-0",
  bare: "rounded-2xl border",
};

function Card({ children, className, variant = "default", ...rest }) {
  return (
    <ShadcnCard
      className={cn(CARD_VARIANTS[variant] || CARD_VARIANTS.default, className)}
      {...rest}
    >
      {children}
    </ShadcnCard>
  );
}

export default Card;
