import { Textarea } from "@mantine/core";

export default function TextArea(props) {
  return (
    <Textarea
      placeholder="Enter text"
      autosize
      minRows={3}
      {...props}
    />
  );
}