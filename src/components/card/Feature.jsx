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
import { Badge } from "components/ui/badge";

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
      className="group flex flex-row no-underline transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-(--shadow-md)"
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

        <div className="flex min-w-0 flex-1 flex-col gap-4 px-4 py-4 md:flex-row md:items-start md:justify-between md:px-5 md:py-5">
          <div className="flex min-w-0 flex-1 flex-col gap-2.5">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="m-0 font-['Space_Grotesk'] text-lg font-semibold leading-tight text-(--text-primary) md:text-[19px]">
                {locale(name)}
              </h4>
              <Badge variant={enabled ? "green" : "secondary"} className="rounded-full px-2 py-0.5 text-[10px] uppercase tracking-[0.14em]">
                {enabled ? <Locale zh="已啟用" en="Enabled" /> : <Locale zh="未啟用" en="Disabled" />}
              </Badge>
            </div>
            <TooltipProvider>
              <Tooltip delayDuration={500}>
                <TooltipTrigger asChild>
                  <p className="m-0 max-w-3xl text-sm leading-6 text-(--text-secondary) line-clamp-2">
                    {description}
                  </p>
                </TooltipTrigger>
                <TooltipContent side="top">
                  {description}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="flex shrink-0 flex-col-reverse items-stretch gap-2 sm:flex-row sm:items-center md:pt-0.5">
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
                className="scale-90 self-start sm:self-center"
              />
            )}
            <Button size="sm" className="h-10 rounded-full px-4 text-sm font-medium shadow-(--shadow-xs)">
              <Locale zh="配置" en="Configure" />
            </Button>
          </div>
        </div>
      </Link>
    </Card>
  );
}
