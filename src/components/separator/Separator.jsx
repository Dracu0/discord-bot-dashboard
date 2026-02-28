import { Divider } from "@mantine/core";
import React from "react";

const HSeparator = (props) => {
    return <Divider {...props} />;
};

const VSeparator = (props) => {
    return <Divider orientation="vertical" {...props} />;
};

export { HSeparator, VSeparator };
