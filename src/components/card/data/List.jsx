import Card from "components/card/Card";
import React from "react";

export function List({ title, description, icon, items }) {
  return (
    <Card className="!p-0">
      <div className="flex flex-col w-full px-[22px] py-[18px]">
        <span className="text-[var(--text-primary)] text-xl font-semibold">
          {title}
        </span>
        <span className="text-[var(--text-secondary)]">{description}</span>
      </div>
      {items.map((item, key) => (
        <ListItem key={key} icon={icon} {...item} />
      ))}
    </Card>
  );
}

function ListItem({ name, description, value, icon: IconComp }) {
  return (
    <div
      className="px-6 py-[21px] transition-all duration-200"
      style={{ background: "transparent" }}
    >
      <div className="flex flex-col justify-center">
        <div className="relative flex items-center">
          <div className="flex flex-col w-[70%] md:w-full me-1 md:me-4 xl:me-6">
            <span className="text-[var(--text-primary)] text-base mb-[5px] font-bold me-3.5">
              {name}
            </span>
            <span className="text-[var(--text-muted)] text-sm font-normal me-3.5">
              {description}
            </span>
          </div>
          <div className="flex items-center me-1 md:me-4 xl:me-6">
            {IconComp && <IconComp size={18} color="var(--text-primary)" style={{ marginRight: 7 }} />}
            <span className="font-bold text-base text-[var(--text-primary)]">
              {value}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
