import { InputField } from "./InputField";
import { Popover, PopoverTrigger, PopoverContent } from "components/ui/popover";
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
            <EmojiPicker onChange={onChange} />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}

function EmojiPicker({ onChange }) {
  const ref = useRef();
  const changeRef = useRef(onChange);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  changeRef.current = onChange;

  useEffect(() => {
    let mounted = true;

    if (ref.current?.childNodes.length !== 0) {
      setLoading(false);
      return;
    }

    Promise.all([
      import("emoji-mart"),
      import("@emoji-mart/data"),
    ])
      .then(([emojiMartModule, emojiDataModule]) => {
        if (!mounted || !ref.current) return;

        const Picker = emojiMartModule?.Picker;
        const pickerData = emojiDataModule?.default;

        if (!Picker || !pickerData) {
          throw new Error("Emoji picker modules failed to load");
        }

        new Picker({
          onEmojiSelect: (e) => changeRef.current(e),
          data: pickerData,
          ref,
        });
        setLoading(false);
      })
      .catch(() => {
        if (!mounted) return;
        setLoadError(true);
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
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
      {loading && <p className="px-4 py-3 text-sm text-(--text-muted)">Loading emoji picker…</p>}
      {loadError && <p className="px-4 py-3 text-sm text-(--status-error)">Could not load emoji picker.</p>}
    </div>
  );
}
