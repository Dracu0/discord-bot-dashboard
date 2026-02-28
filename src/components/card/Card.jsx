import { Paper } from "@mantine/core";

function Card({ variant, children, ...rest }) {
  return (
    <Paper
      radius="lg"
      p="20px"
      withBorder
      style={{
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        ...rest.style,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-1px)";
        e.currentTarget.style.boxShadow = "var(--shadow-md)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "";
        e.currentTarget.style.boxShadow = "";
      }}
      {...rest}
    >
      {children}
    </Paper>
  );
}

export default Card;
