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
    <div className="flex items-center gap-1">
      <span className="text-xs text-muted-foreground mr-1">
        {locale({ zh: "線上", en: "Online" })}
      </span>
      <TooltipProvider>
        <div className="flex -space-x-2">
          {users.slice(0, 5).map((u) => (
            <Tooltip key={u.userId}>
              <TooltipTrigger asChild>
                <Avatar className="h-7 w-7 border-2 border-background">
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
                <Avatar className="h-7 w-7 border-2 border-background">
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
