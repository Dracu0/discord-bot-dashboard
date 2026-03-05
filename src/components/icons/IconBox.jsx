import React from "react";
import { cn } from "lib/utils";

export default function IconBox({ icon, className, ...rest }) {
    return (
        <div
            className={cn("flex items-center justify-center rounded-full", className)}
            {...rest}
        >
            {icon}
        </div>
    );
}
