import React from "react";
import { Button } from "@chakra-ui/react";
import { BiArrowBack } from "react-icons/bi";
import { Link } from "react-router-dom";
import { Locale } from "utils/Language";

export default function BackNavButton({ to, zh = "返回", en = "Back", ariaLabel }) {
  return (
    <Link to={to} aria-label={ariaLabel || en}>
      <Button
        size="sm"
        variant="white"
        leftIcon={<BiArrowBack />}
        minH="40px"
      >
        <Locale zh={zh} en={en} />
      </Button>
    </Link>
  );
}