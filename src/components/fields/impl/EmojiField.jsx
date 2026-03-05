import { InputField } from "./InputField";
import { Popover, PopoverTrigger, PopoverContent } from "components/ui/popover";
import { Picker } from "emoji-mart";
import React, { useEffect, useRef, useCallback, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown } from "lucide-react";
import { QueryHolderSkeleton } from "contexts/components/AsyncContext";

export default function EmojiField({ value, onChange: change }) {
  const query = useQuery({
    queryKey: ["emojis"],
    queryFn: () =>
      fetch("https://cdn.jsdelivr.net/npm/@emoji-mart/data").then((res) =>
        res.json()
      ),
    refetchOnWindowFocus: false,
  });

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
              className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center justify-center h-8 w-8 rounded-[var(--radius-sm)] hover:bg-[var(--surface-secondary)] transition-colors cursor-pointer"
              aria-label="Select Emoji"
            >
              <ChevronDown className="h-[18px] w-[18px] text-[var(--text-muted)]" />
            </button>
          </PopoverTrigger>
          <PopoverContent
            side="top"
            className="w-[350px] p-0 overflow-hidden rounded-2xl"
            style={{ zIndex: 1500 }}
          >
            <QueryHolderSkeleton query={query}>
              <EmojiPicker data={query.data} onChange={onChange} />
            </QueryHolderSkeleton>
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
