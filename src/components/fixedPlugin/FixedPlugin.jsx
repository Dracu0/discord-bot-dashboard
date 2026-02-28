import { ActionIcon } from "@mantine/core";
import { IconMoon, IconSun } from "@tabler/icons-react";
import { useMantineColorScheme } from "@mantine/core";
import React from "react";

export default function FixedPlugin(props) {
    const { ...rest } = props;
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();

    return (
        <ActionIcon
            {...rest}
            size={56}
            radius="xl"
            variant="filled"
            onClick={toggleColorScheme}
            style={{
                position: "fixed",
                right: document.documentElement.dir === "rtl" ? undefined : 35,
                left: document.documentElement.dir === "rtl" ? 35 : undefined,
                bottom: 30,
                zIndex: 50,
                background: "linear-gradient(135deg, #7C3AED 0%, #A78BFA 50%, #22D3EE 100%)",
                border: "1px solid rgba(139, 92, 246, 0.3)",
                boxShadow: "0 4px 24px rgba(124, 58, 237, 0.4)",
                transition: "all 0.25s ease",
            }}
        >
            {colorScheme === "light" ? (
                <IconMoon size={22} color="white" />
            ) : (
                <IconSun size={22} color="white" />
            )}
        </ActionIcon>
    );
}
