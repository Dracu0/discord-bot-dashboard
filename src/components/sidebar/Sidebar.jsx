import React, { useContext } from "react";
import { useDisclosure } from "hooks/useDisclosure";
import { Menu, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Button } from "components/ui/button";
import { Sheet, SheetContent } from "components/ui/sheet";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "components/ui/tooltip";
import Content from "components/sidebar/components/Content";
import { SettingsContext } from "../../contexts/SettingsContext";
import { SIDEBAR_FULL, SIDEBAR_COLLAPSED } from "../../utils/layout-tokens";

function Sidebar({ routes }) {
  const { sidebarCollapsed, updateSettings } = useContext(SettingsContext);
  const width = sidebarCollapsed ? SIDEBAR_COLLAPSED : SIDEBAR_FULL;

  const toggle = () => updateSettings({ sidebarCollapsed: !sidebarCollapsed });

  return (
    <div className="fixed inset-y-0 left-0 z-20 hidden xl:block">
      <div
        className="flex h-screen min-h-full flex-col overflow-hidden border-r border-(--sidebar-border) bg-(--sidebar-bg)"
        style={{
          width,
          transition: "width 0.25s cubic-bezier(.4,0,.2,1)",
          boxShadow: "24px 0 64px color-mix(in srgb, var(--accent-primary) 8%, rgba(2,6,23,0.14))",
        }}
      >
        <div className="flex-1 overflow-y-auto">
          <Content routes={routes} collapsed={sidebarCollapsed} />
        </div>

        <div
          className="flex items-center justify-center border-t border-(--sidebar-border) px-4 py-3"
          style={{
            background:
              "linear-gradient(180deg, color-mix(in srgb, var(--accent-primary) 5%, transparent) 0%, transparent 100%)",
          }}
        >
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-full border border-(--border-subtle) bg-(--surface-primary) text-(--text-secondary) hover:bg-(--surface-secondary)"
                  onClick={toggle}
                  aria-label={
                    sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"
                  }
                  aria-expanded={!sidebarCollapsed}
                >
                  {sidebarCollapsed ? (
                    <ChevronsRight size={18} />
                  ) : (
                    <ChevronsLeft size={18} />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                {sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
}

export function SidebarResponsive({ routes }) {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <div className="flex items-center xl:hidden">
      <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full bg-(--surface-secondary) text-(--text-primary) hover:bg-(--surface-primary)" onClick={open}>
        <Menu size={20} />
      </Button>

      <Sheet open={opened} onOpenChange={(isOpen) => !isOpen && close()}>
        <SheetContent
          side="left"
          className="overflow-hidden border-r border-(--sidebar-border) p-0"
          style={{ width: SIDEBAR_FULL, background: "var(--sidebar-bg)" }}
        >
          <Content routes={routes} collapsed={false} onNavigate={close} />
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default Sidebar;
