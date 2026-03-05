import React from "react";
import { OptionField } from "../OptionPanel";
import { Button } from "components/ui/button";
import { Separator } from "components/ui/separator";

export default function ArrayField({ element, value: valueRaw, onChange }) {
  const value = valueRaw || [];

  const change = (i, v) => {
    const next = [...value];
    next[i] = v;
    onChange(next);
  };

  return (
    <>
      {value.map((val, i) => {
        const option = { id: i, ...element };

        const removeItem = () => {
          onChange(value.filter((_, j) => i !== j));
        };

        return (
          <React.Fragment key={i}>
            {i !== 0 && <Separator className="my-3" />}
            <div className="flex flex-row gap-4">
              <OptionField option={option} value={val} onChange={(v) => change(i, v)} />
              <Button variant="default" onClick={removeItem}>
                Remove
              </Button>
            </div>
          </React.Fragment>
        );
      })}

      {value.length === 0 && (
        <p className="text-[var(--text-muted)]">No items yet</p>
      )}

      <div className="mt-2">
        <Button onClick={() => onChange([...value, element.holder])}>Add New</Button>
      </div>
    </>
  );
}
