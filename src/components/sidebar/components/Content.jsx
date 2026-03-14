import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "components/ui/button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "components/ui/tooltip";
import Brand from "components/sidebar/components/Brand";
import Links from "components/sidebar/components/Links";
import { Locale } from "../../../utils/Language";

function SidebarContent({ routes, collapsed, onNavigate }) {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/admin");
    onNavigate?.();
  };

  return (
    <div className="flex h-full flex-col px-3 pb-3 pt-3.5">
      <div
        className={`mb-2.5 flex items-center gap-2 ${
          collapsed ? "justify-center px-0" : "justify-start px-2"
        }`}
      >
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-xl border border-(--border-subtle) bg-(--surface-primary) text-(--text-secondary) hover:bg-(--surface-secondary)"
                onClick={handleBack}
                aria-label="Back to servers"
              >
                <ArrowLeft size={18} />
              </Button>
            </TooltipTrigger>
            {collapsed && (
              <TooltipContent side="right">Back to servers</TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
        {!collapsed && (
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-(--text-muted)">
            <Locale zh="\u8FD4\u56DE" en="Back" />
          </span>
        )}
      </div>
      <Brand collapsed={collapsed} />
      <div className="mb-auto mt-3.5">
        <div className={collapsed ? "px-1" : "px-2"}>
          <Links routes={routes} collapsed={collapsed} onNavigate={onNavigate} />
        </div>
      </div>

    </div>
  );
}

export default SidebarContent;
