import React, { useContext } from "react";
import Card from "components/card/Card";
import { Link } from "react-router-dom";
import { GuildContext } from "contexts/guild/GuildContext";
import { Locale, useLocale } from "../../utils/Language";
import { ArrowRight } from "lucide-react";
import { Button } from "components/ui/button";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "components/ui/tooltip";

export function Action({ id, action }) {
  const { id: serverId } = useContext(GuildContext);
  const configUrl = `/guild/${serverId}/actions/${id}`;
  const locale = useLocale();

  return (
    <Card
      variant="flush"
      className="flex flex-row no-underline transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-(--shadow-md)"
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

        <div className="flex min-w-0 flex-1 items-center justify-between gap-4 px-4 py-4 md:px-5">
          <div className="flex flex-col gap-1 flex-1 min-w-0">
            <h4
              className="text-(--text-primary) font-['Space_Grotesk'] leading-[1.3] truncate m-0 text-base font-semibold"
            >
              {locale(action.name)}
            </h4>
            <TooltipProvider>
              <Tooltip delayDuration={500}>
                <TooltipTrigger asChild>
                  <p className="text-(--text-secondary) text-sm font-normal leading-normal line-clamp-1 m-0">
                    {action.description}
                  </p>
                </TooltipTrigger>
                <TooltipContent side="top">
                  {action.description}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="flex items-center shrink-0">
            <Button size="sm" className="h-9 rounded-md px-3 text-sm font-medium">
              <Locale zh="打開" en="Open" />
              <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </Link>
    </Card>
  );
}
