import { TextInput } from "@mantine/core";

export function InputField(props) {
  return (
    <TextInput
      fw={500}
      styles={{ input: { fontWeight: 500 } }}
      {...props}
    />
  );
}