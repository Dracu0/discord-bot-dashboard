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
    <div className="hidden xl:block fixed min-h-full" style={{ zIndex: 20 }}>
      <div
        className="h-screen min-h-full overflow-x-hidden flex flex-col"
        style={{
          width,
          background: "var(--sidebar-bg)",
          borderRight: "1px solid var(--sidebar-border)",
          transition: "width 0.25s cubic-bezier(.4,0,.2,1)",
        }}
      >
        <div className="overflow-y-auto flex-1">
          <Content routes={routes} collapsed={sidebarCollapsed} />
        </div>

        {/* Collapse toggle */}
        <div
          className="flex justify-center py-2"
          style={{ borderTop: "1px solid var(--sidebar-border)" }}
        >
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full h-8 w-8 text-[var(--text-muted)]"
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
      <Button variant="ghost" size="icon" className="h-10 w-10 text-[var(--text-muted)]" onClick={open}>
        <Menu size={20} />
      </Button>

      <Sheet open={opened} onOpenChange={(isOpen) => !isOpen && close()}>
        <SheetContent
          side="left"
          className="p-0"
          style={{ width: SIDEBAR_FULL, background: "var(--sidebar-bg)" }}
        >
          <Content routes={routes} collapsed={false} onNavigate={close} />
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default Sidebar;
