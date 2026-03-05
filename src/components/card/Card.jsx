import { Paper } from "@mantine/core";

function Card({ children, ...rest }) {
  return (
    <Paper
      radius="lg"
      p="20px"
      withBorder
      {...rest}
    >
      {children}
    </Paper>
  );
}

export default Card;
