import Card from "components/card/Card";
import React from "react";

export default function Default(props) {
  const { startContent, endContent, name, value } = props;

  return (
    <Card className="py-[15px]">
      <div className="flex my-auto h-full items-center xl:items-start justify-center">
        {startContent}

        <div className="my-auto" style={{ marginInlineStart: startContent ? 18 : 0 }}>
          <span className="leading-none text-[var(--text-secondary)] text-sm font-medium block">
            {name}
          </span>
          <span className="text-[var(--text-primary)] text-2xl font-['Space_Grotesk'] font-bold block">
            {value}
          </span>
        </div>
        <div className="ms-auto w-max flex">
          {endContent}
        </div>
      </div>
    </Card>
  );
}
