import React from "react";
import StatCard from "./StatCard";

export default function Default(props) {
  const { startContent, endContent, name, value } = props;

  return (
    <StatCard
      label={name}
      value={value}
      startContent={startContent}
      endContent={endContent}
    />
  );
}
