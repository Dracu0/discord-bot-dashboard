import { InputField } from "./InputField";
import { ActionIcon, Box, Popover } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Picker } from "emoji-mart";
import React, { useEffect, useRef, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { IconChevronDown } from "@tabler/icons-react";
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

  const [opened, { toggle, close }] = useDisclosure();

  return (
    <div style={{ position: "relative" }}>
      <InputField
        value={value}
        placeholder="Select a Emoji"
        readOnly
        onFocus={toggle}
        styles={{ input: { fontSize: 30 } }}
        rightSection={
          <Popover
            position="top"
            opened={opened}
            onClose={close}
            width={350}
            zIndex={1500}
          >
            <Popover.Target>
              <ActionIcon variant="subtle" aria-label="Select Emoji" onClick={toggle}>
                <IconChevronDown size={18} />
              </ActionIcon>
            </Popover.Target>
            <Popover.Dropdown p={0} style={{ overflow: "hidden", borderRadius: 16 }}>
              <QueryHolderSkeleton query={query}>
                <EmojiPicker data={query.data} onChange={onChange} />
              </QueryHolderSkeleton>
            </Popover.Dropdown>
          </Popover>
        }
      />
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
    <Box
      style={{
        "--rgb-background": bg,
        "--rgb-accent": brand,
        "--rgb-input": bg,
        "--rgb-color": textColor,
      }}
    >
      <div ref={ref} style={{ width: "100%" }} />
    </Box>
  );
}