import React, { useContext } from "react";
import { GuildContext } from "contexts/guild/GuildContext";
import { Locale, useLocale } from "../../utils/Language";
import { ArrowRight } from "lucide-react";
import { Button } from "components/ui/button";
import { AccentCardLink } from "components/card/primitives";

export function Action({ id, action }) {
  const { id: serverId } = useContext(GuildContext);
  const configUrl = `/guild/${serverId}/actions/${id}`;
  const locale = useLocale();

  return (
    <AccentCardLink
      to={configUrl}
      accent="linear-gradient(180deg, var(--color-brand-600), var(--color-accent-400))"
      title={locale(action.name)}
      description={action.description}
      controls={(
        <Button size="sm" className="h-10 rounded-xl px-4 text-sm font-semibold shadow-(--shadow-xs)">
          <Locale zh="打開" en="Open" />
          <ArrowRight className="ml-1 h-3.5 w-3.5" />
        </Button>
      )}
    />
  );
}
