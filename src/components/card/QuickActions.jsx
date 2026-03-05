import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Puzzle, Hand, Settings } from "lucide-react";
import { GuildContext } from "contexts/guild/GuildContext";
import { Locale } from "utils/Language";
import { Button } from "components/ui/button";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "components/ui/tooltip";

const actions = [
  {
    icon: Puzzle,
    label: { zh: "管理功能", en: "Manage Features" },
    path: "features",
    color: "brand",
  },
  {
    icon: Hand,
    label: { zh: "管理動作", en: "Manage Actions" },
    path: "actions",
    color: "brand",
  },
  {
    icon: Settings,
    label: { zh: "伺服器設定", en: "Server Settings" },
    path: "settings",
    color: "gray",
  },
];

export default function QuickActions() {
  const { id: serverId } = useContext(GuildContext);

  return (
    <div className="mb-6">
      <span className="block text-sm font-semibold text-[var(--text-primary)] mb-2.5 font-['Space_Grotesk'] tracking-tight">
        <Locale zh="快捷操作" en="Quick Actions" />
      </span>
      <TooltipProvider>
        <div className="flex items-center gap-2.5">
          {actions.map(({ icon: Icon, label, path, color }) => (
            <Tooltip key={path}>
              <TooltipTrigger asChild>
                <Button
                  variant={color === "gray" ? "secondary" : "default"}
                  size="sm"
                  className="rounded-md"
                  asChild
                >
                  <Link to={`/guild/${serverId}/${path}`}>
                    <Icon className="h-4 w-4 mr-1.5" />
                    <Locale {...label} />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <Locale {...label} />
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </TooltipProvider>
    </div>
  );
}
