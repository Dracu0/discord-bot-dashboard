import Card from "components/card/Card";
import React from "react";

export function List({ title, description, icon, items }) {
  return (
    <Card variant="flush" className="overflow-hidden">
      <div className="flex w-full flex-col gap-1 border-b border-(--border-subtle) bg-(--surface-card) px-5 py-4.5 md:px-6 md:py-5">
        <span className="font-['Space_Grotesk'] text-xl font-semibold text-(--text-primary)">
          {title}
        </span>
        <span className="text-sm text-(--text-secondary)">{description}</span>
      </div>
      {(items || []).map((item, key) => (
        <ListItem key={key} icon={icon} {...item} />
      ))}
    </Card>
  );
}

function ListItem({ name, description, value, icon: IconComp }) {
  return (
    <div
      className="border-b border-(--border-subtle) px-5 py-5 transition-all duration-200 last:border-b-0 md:px-6"
      style={{ background: "transparent" }}
    >
      <div className="flex flex-col justify-center">
        <div className="relative flex items-center justify-between gap-4">
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="mb-1.25 me-3.5 text-base font-bold text-(--text-primary)">
              {name}
            </span>
            <span className="me-3.5 text-sm font-normal text-(--text-muted)">
              {description}
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-2 text-right">
            {IconComp && <IconComp size={18} color="var(--text-primary)" style={{ marginRight: 7 }} />}
            <span className="font-bold text-base text-(--text-primary)">
              {value}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
