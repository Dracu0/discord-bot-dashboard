import data from "@emoji-mart/data";
import { InputField } from "./InputField";
import { Popover, PopoverTrigger, PopoverContent } from "components/ui/popover";
import { Picker } from "emoji-mart";
import React, { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

export default function EmojiField({ value, onChange: change }) {
  const onChange = (event) => {
    change(event.native);
  };

  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <div className="relative">
        <InputField
          value={value}
          placeholder="Select a Emoji"
          readOnly
          onClick={() => setOpen(!open)}
          className="text-[30px] pr-10 cursor-pointer"
        />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="absolute right-2 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-sm transition-colors cursor-pointer hover:bg-(--surface-secondary)"
              aria-label="Select Emoji"
            >
              <ChevronDown className="h-4.5 w-4.5 text-(--text-muted)" />
            </button>
          </PopoverTrigger>
          <PopoverContent
            side="top"
            className="w-87.5 overflow-hidden rounded-2xl p-0"
            style={{ zIndex: 1500 }}
          >
            <EmojiPicker data={data} onChange={onChange} />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}

function EmojiPicker({ data, onChange }) {
  const ref = useRef();
  const changeRef = useRef(onChange);
  changeRef.current = onChange;

  useEffect(() => {
    if (ref.current.childNodes.length !== 0) return;

    new Picker({
      onEmojiSelect: (e) => changeRef.current(e),
      data,
      ref,
    });
  }, []);

  return (
    <div
      style={{
        "--rgb-background": "var(--surface-card)",
        "--rgb-accent": "var(--accent-primary)",
        "--rgb-input": "var(--surface-secondary)",
        "--rgb-color": "var(--text-primary)",
      }}
    >
      <div ref={ref} className="w-full" />
    </div>
  );
}
