import * as TabsPrimitive from "@radix-ui/react-tabs";
import { forwardRef } from "react";
import { cn } from "lib/utils";

const Tabs = TabsPrimitive.Root;

const TabsList = forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-9 items-center justify-center rounded-(--radius-md) bg-(--surface-secondary) p-1 text-(--text-muted)",
      className
    )}
    {...props}
  />
));
TabsList.displayName = "TabsList";

const TabsTrigger = forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-(--radius-sm) px-3 py-1 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--accent-primary) disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-(--surface-primary) data-[state=active]:text-(--text-primary) data-[state=active]:shadow-(--shadow-xs) cursor-pointer",
      className
    )}
    {...props}
  />
));
TabsTrigger.displayName = "TabsTrigger";

const TabsContent = forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn("mt-2 focus-visible:outline-none", className)}
    {...props}
  />
));
TabsContent.displayName = "TabsContent";

export { Tabs, TabsList, TabsTrigger, TabsContent };
