import React, { useContext } from "react";
import Card from "components/card/Card";
import { Link } from "react-router-dom";
import { GuildContext } from "contexts/guild/GuildContext";
import { Locale, useLocale } from "../../utils/Language";
import { ArrowRight } from "lucide-react";
import { Button } from "components/ui/button";

export function Action({ id, action }) {
  const { id: serverId } = useContext(GuildContext);
  const configUrl = `/guild/${serverId}/actions/${id}`;
  const locale = useLocale();

  return (
    <Card
      className="!p-0 overflow-hidden no-underline flex flex-row"
      asChild
    >
      <Link to={configUrl}>
        <div
          className="w-1 shrink-0"
          style={{
            background: "linear-gradient(180deg, var(--color-brand-600), var(--color-accent-400))",
            borderRadius: "var(--radius-lg) 0 0 var(--radius-lg)",
          }}
        />

        <div className="flex items-center justify-between gap-4 p-4 flex-1 min-w-0">
          <div className="flex flex-col gap-1 flex-1 min-w-0">
            <span className="text-[var(--text-primary)] text-lg font-semibold font-['Space_Grotesk'] truncate">
              {locale(action.name)}
            </span>
            <span className="text-[var(--text-secondary)] text-sm leading-[1.5] line-clamp-1">
              {action.description}
            </span>
          </div>

          <div className="flex items-center shrink-0">
            <Button size="sm" className="h-9 text-sm font-medium rounded-md">
              <Locale zh="打開" en="Open" />
              <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </Link>
    </Card>
  );
}
