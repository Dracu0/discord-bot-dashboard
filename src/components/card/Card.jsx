import { Card as ShadcnCard } from "components/ui/card";
import { cn } from "lib/utils";

function Card({ children, className, ...rest }) {
  return (
    <ShadcnCard
      className={cn("rounded-2xl p-5 border", className)}
      {...rest}
    >
      {children}
    </ShadcnCard>
  );
}

export default Card;
