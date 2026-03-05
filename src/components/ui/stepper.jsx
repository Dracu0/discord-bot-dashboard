import { cn } from "lib/utils";
import { Check } from "lucide-react";

function Stepper({ active = 0, children, className }) {
  const steps = Array.isArray(children) ? children : [children];
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="flex items-center gap-2">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-medium transition-colors",
                index < active
                  ? "bg-[var(--accent-primary)] text-white"
                  : index === active
                    ? "bg-[var(--accent-primary)] text-white ring-4 ring-[var(--accent-primary)]/20"
                    : "bg-[var(--surface-secondary)] text-[var(--text-muted)]"
              )}
            >
              {index < active ? <Check className="h-4 w-4" /> : index + 1}
            </div>
            {step.props?.label && (
              <span className={cn(
                "text-sm font-medium hidden sm:inline",
                index <= active ? "text-[var(--text-primary)]" : "text-[var(--text-muted)]"
              )}>
                {step.props.label}
              </span>
            )}
            {index < steps.length - 1 && (
              <div className={cn(
                "h-0.5 w-8 sm:w-12 rounded-full transition-colors",
                index < active ? "bg-[var(--accent-primary)]" : "bg-[var(--border-default)]"
              )} />
            )}
          </div>
        ))}
      </div>
      <div>
        {steps[active]}
      </div>
    </div>
  );
}

function StepperStep({ label, children }) {
  return <div>{children}</div>;
}

export { Stepper, StepperStep };
