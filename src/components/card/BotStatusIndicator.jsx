import React from "react";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "components/ui/tooltip";
import { useBotStatus } from "hooks/useWebSocket";
import { Locale } from "utils/Language";

const STATUS_MAP = {
  online: { color: "green", label: { zh: "在線", en: "Online" } },
  idle: { color: "yellow", label: { zh: "閒置", en: "Idle" } },
  dnd: { color: "red", label: { zh: "請勿打擾", en: "Busy" } },
  offline: { color: "gray", label: { zh: "離線", en: "Offline" } },
  unknown: { color: "gray", label: { zh: "狀態未知", en: "Status unknown" } },
};

const STATUS_DOT_CLASSES = {
  green: "bg-green-500",
  yellow: "bg-yellow-500",
  red: "bg-red-500",
  gray: "bg-gray-500",
};

export default function BotStatusIndicator() {
  const botStatus = useBotStatus();
  const status = botStatus?.status || "unknown";
  const cfg = STATUS_MAP[status] || STATUS_MAP.unknown;
  const ping = botStatus?.ping;
  const hasLiveStatus = Boolean(botStatus?.status);

  return (
    <div className="flex items-center gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="inline-flex cursor-default items-center gap-2 rounded-full border border-(--border-subtle) bg-(--surface-primary) px-3 py-1.5 text-xs font-semibold text-(--text-primary) shadow-(--shadow-xs)">
              <span className={`h-2.5 w-2.5 rounded-full ${STATUS_DOT_CLASSES[cfg.color] || "bg-gray-500"}`} />
              <span><Locale {...cfg.label} /></span>
              {hasLiveStatus && ping != null && <span className="text-(--text-muted)">{ping}ms</span>}
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            {hasLiveStatus
              ? (ping != null ? `Ping: ${ping}ms` : "Live status received")
              : "Waiting for live bot telemetry"}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
