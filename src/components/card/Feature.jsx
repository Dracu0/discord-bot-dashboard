import { Link } from "react-router-dom";
import Card from "components/card/Card";
import React, { useCallback, useContext } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getFeatureDetail } from "api/internal";
import { GuildContext } from "../../contexts/guild/GuildContext";
import { Locale, useLocale } from "../../utils/Language";
import { Button } from "components/ui/button";
import { Switch } from "components/ui/switch";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "components/ui/tooltip";

export default function Feature({ banner, name, description, id: featureId, enabled, canToggle, onToggle, isToggling }) {
  const { id: serverId } = useContext(GuildContext);
  const configUrl = `/guild/${serverId}/features/${featureId}`;
  const locale = useLocale();
  const queryClient = useQueryClient();

  const prefetch = useCallback(() => {
    queryClient.prefetchQuery({
      queryKey: ["feature_detail", serverId, featureId],
      queryFn: () => getFeatureDetail(serverId, featureId),
      staleTime: 30_000,
    });
  }, [queryClient, serverId, featureId]);

  return (
    <Card
      variant="flush"
      className="flex flex-row no-underline transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-(--shadow-md)"
      style={{
        opacity: canToggle && !enabled ? 0.7 : 1,
      }}
      asChild
    >
      <Link to={configUrl} onMouseEnter={prefetch}>
        <div
          className="w-1 shrink-0"
          style={{
            background: enabled
              ? "var(--status-success)"
              : "linear-gradient(180deg, var(--color-brand-500), var(--color-brand-300))",
            borderRadius: "var(--radius-lg) 0 0 var(--radius-lg)",
          }}
        />

        <div className="flex min-w-0 flex-1 items-center justify-between gap-4 px-4 py-4 md:px-5">
          <div className="flex flex-col gap-1 flex-1 min-w-0">
            <h4
              className="text-(--text-primary) font-['Space_Grotesk'] leading-[1.3] truncate m-0 text-base font-semibold"
            >
              {locale(name)}
            </h4>
            <TooltipProvider>
              <Tooltip delayDuration={500}>
                <TooltipTrigger asChild>
                  <p className="text-(--text-secondary) text-sm font-normal leading-[1.5] line-clamp-1 m-0">
                    {description}
                  </p>
                </TooltipTrigger>
                <TooltipContent side="top">
                  {description}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="flex shrink-0 items-center gap-2 self-stretch">
            {canToggle && (
              <Switch
                checked={enabled}
                onCheckedChange={(checked) => {
                  onToggle?.(!enabled);
                }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onToggle?.(!enabled);
                }}
                disabled={isToggling}
                className="scale-90"
              />
            )}
            <Button size="sm" className="h-9 rounded-md px-3 text-sm font-medium">
              <Locale zh="配置" en="Configure" />
            </Button>
          </div>
        </div>
      </Link>
    </Card>
  );
}
