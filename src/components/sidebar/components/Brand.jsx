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
        <div className="flex flex-col items-center gap-1 my-5">
          {collapsed ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span
                    className="font-extrabold text-lg"
                    style={{
                      color: "var(--accent-primary)",
                      fontFamily: "'Space Grotesk', 'DM Sans', sans-serif",
                    }}
                  >
                    {config.name.charAt(0)}
                  </span>
                </TooltipTrigger>
                <TooltipContent side="right">{config.name}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <>
              <span
                className="font-extrabold text-xl"
                style={{
                  color: "var(--accent-primary)",
                  fontFamily: "'Space Grotesk', 'DM Sans', sans-serif",
                  letterSpacing: "-0.5px",
                }}
              >
                {config.name}
              </span>
              <span
                className="text-xs font-medium"
                style={{ color: "var(--text-muted)" }}
              >
                Dashboard
              </span>
            </>
          )}
        </div>
      )}
      {!collapsed && (
        <Separator
          className="w-4/5 mb-5"
          style={{ background: "var(--sidebar-border)" }}
        />
      )}
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
      <div className="flex flex-col items-center gap-1 mt-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Avatar className="h-8 w-8">
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
    <div className="flex flex-col items-center gap-2 mt-2">
      <span
        className="font-extrabold text-xs uppercase"
        style={{
          color: "var(--accent-primary)",
          fontFamily: "'Space Grotesk', 'DM Sans', sans-serif",
          letterSpacing: "1px",
        }}
      >
        {config.name}
      </span>
      <div
        className="flex items-center gap-3 px-4 py-2"
        style={{
          borderRadius: 16,
          background: "var(--surface-secondary)",
        }}
      >
        <Avatar className="h-8 w-8">
          <AvatarImage src={icon} alt={query.data.name} />
          <AvatarFallback>{query.data.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <span
          className="font-bold text-lg"
          style={{ color: "var(--text-primary)" }}
        >
          {query.data.name}
        </span>
      </div>
    </div>
  );
}

export default SidebarBrand;
