import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "components/ui/avatar";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "components/ui/tooltip";
import { usePresence } from "hooks/useWebSocket";
import { useLocale } from "utils/Language";

export default function ActiveUsers({ guildId, page }) {
  const users = usePresence(guildId, page);
  const locale = useLocale();

  if (!users || users.length === 0) return null;

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-(--border-subtle) bg-(--surface-primary) px-2.5 py-1.5 shadow-(--shadow-xs)">
      <span className="text-xs font-semibold uppercase tracking-[0.12em] text-(--text-muted)">
        {locale({ zh: "線上", en: "Online" })}
      </span>
      <TooltipProvider>
        <div className="flex -space-x-2">
          {users.slice(0, 5).map((u) => (
            <Tooltip key={u.userId}>
              <TooltipTrigger asChild>
                <Avatar className="h-7 w-7 border-2 border-(--surface-card)">
                  {u.avatar ? (
                    <AvatarImage
                      src={`https://cdn.discordapp.com/avatars/${u.userId}/${u.avatar}.webp?size=64`}
                      alt={u.username}
                    />
                  ) : null}
                  <AvatarFallback className="text-[10px] bg-blue-500 text-white">
                    {u.username?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent>
                {`${u.username} — ${u.page || "?"}`}
              </TooltipContent>
            </Tooltip>
          ))}
          {users.length > 5 && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Avatar className="h-7 w-7 border-2 border-(--surface-card)">
                  <AvatarFallback className="text-[10px] bg-gray-500 text-white">
                    +{users.length - 5}
                  </AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent>
                {users.slice(5).map((u) => u.username).join(", ")}
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </TooltipProvider>
    </div>
  );
}
