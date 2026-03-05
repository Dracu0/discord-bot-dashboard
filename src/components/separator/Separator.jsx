import React from "react";
import { Separator } from "components/ui/separator";

const HSeparator = (props) => {
    return <Separator orientation="horizontal" {...props} />;
};

const VSeparator = (props) => {
    return <Separator orientation="vertical" {...props} />;
};

export { HSeparator, VSeparator };
