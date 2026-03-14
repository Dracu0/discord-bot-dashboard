import React, { useCallback, useContext } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getFeatureDetail } from "api/internal";
import { GuildContext } from "../../contexts/guild/GuildContext";
import { Locale, useLocale } from "../../utils/Language";
import { Button } from "components/ui/button";
import { Switch } from "components/ui/switch";
import { Badge } from "components/ui/badge";
import { AccentCardLink } from "components/card/primitives";

export default function Feature({ name, description, id: featureId, enabled, canToggle, onToggle, isToggling }) {
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
    <AccentCardLink
      to={configUrl}
      onMouseEnter={prefetch}
      accent={
        enabled
          ? "var(--status-success)"
          : "linear-gradient(180deg, var(--color-brand-500), var(--color-brand-300))"
      }
      dimmed={canToggle && !enabled}
      title={locale(name)}
      description={description}
      badge={
        <Badge variant={enabled ? "green" : "secondary"} className="rounded-full px-2 py-0.5 text-[10px] uppercase tracking-[0.14em]">
          {enabled ? <Locale zh="已啟用" en="Enabled" /> : <Locale zh="未啟用" en="Disabled" />}
        </Badge>
      }
      controls={(
        <>
          {canToggle && (
            <Switch
              checked={enabled}
              onCheckedChange={() => {
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
          <Button size="sm" className="h-10 rounded-xl px-4 text-sm font-semibold shadow-(--shadow-xs)">
            <Locale zh="配置" en="Configure" />
          </Button>
        </>
      )}
    />
  );
}
