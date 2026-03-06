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
      className="group flex flex-row no-underline transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-(--shadow-md)"
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

        <div className="flex min-w-0 flex-1 flex-col gap-4 px-4 py-4 md:flex-row md:items-start md:justify-between md:px-5 md:py-5">
          <div className="flex min-w-0 flex-1 flex-col gap-2.5">
            <h4 className="m-0 font-['Space_Grotesk'] text-lg font-semibold leading-tight text-(--text-primary) md:text-[19px]">
              {locale(action.name)}
            </h4>
            <TooltipProvider>
              <Tooltip delayDuration={500}>
                <TooltipTrigger asChild>
                  <p className="m-0 max-w-3xl text-sm leading-6 text-(--text-secondary) line-clamp-2">
                    {action.description}
                  </p>
                </TooltipTrigger>
                <TooltipContent side="top">
                  {action.description}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="flex shrink-0 items-center md:pt-0.5">
            <Button size="sm" className="h-10 rounded-full px-4 text-sm font-medium shadow-(--shadow-xs)">
              <Locale zh="打開" en="Open" />
              <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </Link>
    </Card>
  );
}
