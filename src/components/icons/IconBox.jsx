import React from "react";
import { Center } from "@mantine/core";

export default function IconBox(props) {
    const { icon, ...rest } = props;

    return (
        <Center
            style={{ borderRadius: "50%" }}
            {...rest}
        >
            {icon}
        </Center>
    );
}
