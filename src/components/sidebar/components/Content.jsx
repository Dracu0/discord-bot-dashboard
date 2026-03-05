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
    <div className="flex flex-col h-full pt-4">
      <div
        className={`flex items-center gap-2 mb-2 ${
          collapsed ? "px-0 justify-center" : "px-5 justify-start"
        }`}
      >
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full h-7 w-7 text-[var(--text-muted)]"
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
          <span
            className="text-xs font-semibold"
            style={{ color: "var(--text-muted)" }}
          >
            <Locale zh="\u8FD4\u56DE" en="Back" />
          </span>
        )}
      </div>
      <Brand collapsed={collapsed} />
      <div className="mt-2 mb-auto">
        <div
          style={{
            paddingInlineStart: collapsed ? 8 : 16,
            paddingInlineEnd: collapsed ? 8 : 12,
          }}
        >
          <Links routes={routes} collapsed={collapsed} onNavigate={onNavigate} />
        </div>
      </div>
    </div>
  );
}

export default SidebarContent;
