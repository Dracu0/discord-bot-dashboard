import React from "react";
import { Badge } from "components/ui/badge";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "components/ui/tooltip";
import { useBotStatus } from "hooks/useWebSocket";
import { Locale } from "utils/Language";

const STATUS_MAP = {
  online: { color: "green", label: { zh: "在線", en: "Online" } },
  idle: { color: "yellow", label: { zh: "閒置", en: "Idle" } },
  dnd: { color: "red", label: { zh: "請勿打擾", en: "Busy" } },
  offline: { color: "gray", label: { zh: "離線", en: "Offline" } },
};

const STATUS_DOT_CLASSES = {
  green: "bg-green-500",
  yellow: "bg-yellow-500",
  red: "bg-red-500",
  gray: "bg-gray-500",
};

export default function BotStatusIndicator() {
  const botStatus = useBotStatus();
  const status = botStatus?.status || "offline";
  const cfg = STATUS_MAP[status] || STATUS_MAP.offline;
  const ping = botStatus?.ping;

  return (
    <div className="flex items-center gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge
              variant="outline"
              className="cursor-default normal-case rounded-md text-xs font-semibold px-2.5 py-1 flex items-center gap-1.5"
            >
              <span className={`h-2 w-2 rounded-full ${STATUS_DOT_CLASSES[cfg.color] || "bg-gray-500"}`} />
              <span>
                <Locale {...cfg.label} />
              </span>
            </Badge>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            {ping != null ? `Ping: ${ping}ms` : "No data yet"}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
