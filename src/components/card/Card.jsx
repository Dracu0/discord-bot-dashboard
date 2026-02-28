import { Paper } from "@mantine/core";

function Card({ variant, children, ...rest }) {
  return (
    <Paper radius="lg" p="20px" withBorder {...rest}>
      {children}
    </Paper>
  );
}

export default Card;
