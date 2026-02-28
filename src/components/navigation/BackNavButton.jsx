import React from "react";
import { Button } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { Locale } from "utils/Language";

export default function BackNavButton({ to, zh = "\u8fd4\u56de", en = "Back", ariaLabel }) {
    return (
        <Button
            component={Link}
            to={to}
            aria-label={ariaLabel || en}
            size="sm"
            variant="default"
            leftSection={<IconArrowLeft size={16} />}
            mih={{ base: 44, md: 40 }}
        >
            <Locale zh={zh} en={en} />
        </Button>
    );
}