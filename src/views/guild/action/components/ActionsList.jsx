import { cn } from "lib/utils";

import { Action } from "components/card/Action";
import { config } from "config/config";
import { Locale } from "utils/Language";

export default function ActionsList() {
    return (
        <div className="flex flex-col gap-5">
            <span
                className="text-(--text-primary) text-2xl font-bold ms-6 mt-11"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
                <Locale zh="動作列表" en="Actions List" />
            </span>
            <div className="flex flex-col gap-3">
                <Actions />
            </div>
        </div>
    );
}

function Actions() {
    return Object.entries(config.actions).map(([id, action], index) => (
        <div
            key={id}
            className={cn(
                "transition-all duration-300 ease-out",
                "animate-in zoom-in-95 fade-in"
            )}
            style={{ animationDelay: `${index * 60}ms`, animationFillMode: "backwards" }}
        >
            <Action id={id} action={action} />
        </div>
    ));
}
