import React, { useContext } from "react";
import { GuildContext } from "contexts/guild/GuildContext";
import { iconToUrl, useGuild } from "api/discord/DiscordApi";
import { config } from "../../../config/config";
import { Avatar, AvatarImage, AvatarFallback } from "components/ui/avatar";
import { Skeleton } from "components/ui/skeleton";
import { Separator } from "components/ui/separator";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "components/ui/tooltip";

export function SidebarBrand({ collapsed }) {
  const { id } = useContext(GuildContext);

  return (
    <div className="flex flex-col items-center gap-4">
      {id != null ? (
        <GuildHeader id={id} collapsed={collapsed} />
      ) : (
        <div className="my-3 flex flex-col items-center gap-2">
          {collapsed ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-(--accent-primary)/10 font-['Space_Grotesk'] text-lg font-extrabold text-(--accent-primary)">
                    {config.name.charAt(0)}
                  </span>
                </TooltipTrigger>
                <TooltipContent side="right">{config.name}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <>
              <div className="flex items-center gap-3 rounded-[28px] border border-(--border-subtle) bg-(--surface-primary) px-4 py-3 shadow-(--shadow-xs)">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-(--accent-primary)/10 font-['Space_Grotesk'] text-xl font-extrabold text-(--accent-primary)">
                  {config.name.charAt(0)}
                </span>
                <div className="min-w-0">
                  <span className="block font-['Space_Grotesk'] text-lg font-bold tracking-tight text-(--text-primary)">
                    {config.name}
                  </span>
                  <span className="block text-xs font-medium uppercase tracking-[0.14em] text-(--text-muted)">
                    Dashboard workspace
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      )}
      {!collapsed && <Separator className="mb-4 w-full bg-(--sidebar-border)" />}
    </div>
  );
}

function GuildHeader({ id, collapsed }) {
  const query = useGuild(id);

  if (query.isLoading) {
    return (
      <Skeleton
        className={
          collapsed ? "h-10 w-10 rounded-full" : "h-20 w-4/5 rounded-full"
        }
      />
    );
  }

  const icon = iconToUrl(query.data.id, query.data.icon);

  if (collapsed) {
    return (
      <div className="mt-1 flex flex-col items-center gap-1">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Avatar className="h-10 w-10 border border-(--border-subtle) shadow-(--shadow-xs)">
                <AvatarImage src={icon} alt={query.data.name} />
                <AvatarFallback>{query.data.name.charAt(0)}</AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent side="right">{query.data.name}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    );
  }

  return (
    <div className="mt-1 flex flex-col gap-3">
      <span className="px-2 font-['Space_Grotesk'] text-[11px] font-extrabold uppercase tracking-[0.18em] text-(--accent-primary)">
        {config.name}
      </span>
      <div
        className="flex items-center gap-3 rounded-[28px] border border-(--border-subtle) bg-(--surface-primary) px-4 py-3 shadow-(--shadow-xs)"
      >
        <Avatar className="h-11 w-11 border border-(--border-subtle)">
          <AvatarImage src={icon} alt={query.data.name} />
          <AvatarFallback>{query.data.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <span className="block truncate font-['Space_Grotesk'] text-base font-bold text-(--text-primary)">
            {query.data.name}
          </span>
          <span className="block text-xs text-(--text-muted)">Guild workspace</span>
        </div>
      </div>
    </div>
  );
}

export default SidebarBrand;
