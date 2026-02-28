import React from "react";
import { OptionField } from "../OptionPanel";
import { Box, Button, Divider, Flex, Text } from "@mantine/core";

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
            {i !== 0 && <Divider my="sm" />}
            <Flex direction="row" gap="md">
              <OptionField option={option} value={val} onChange={(v) => change(i, v)} />
              <Button variant="filled" color="brand" onClick={removeItem}>
                Remove
              </Button>
            </Flex>
          </React.Fragment>
        );
      })}

      {value.length === 0 && <Text c="dimmed">No items yet</Text>}

      <Box mt="xs">
        <Button onClick={() => onChange([...value, element.holder])}>Add New</Button>
      </Box>
    </>
  );
}