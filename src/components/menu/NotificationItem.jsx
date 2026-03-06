import { ArrowUp } from "lucide-react";
import React from "react";

export function NotificationItem({ title, description, image }) {
    return (
        <>
            <div
                className="rounded-lg overflow-hidden me-3.5 h-[60px] w-[60px] md:h-[70px] md:w-[70px] shrink-0"
            >
                {image ? <img src={image} className="w-full h-full object-cover" alt="" /> : <ItemIcon />}
            </div>

            <div className="flex flex-col">
                <span className="mb-1.5 font-bold text-(--text-primary) text-base">
                    {title}
                </span>
                <div className="flex items-center">
                    <span className="text-sm leading-none text-(--text-secondary)">
                        {description}
                    </span>
                </div>
            </div>
        </>
    );
}

function ItemIcon() {
    return (
        <div
            className="flex items-center justify-center h-full"
            style={{ background: "linear-gradient(135deg, #60A5FA 0%, #0EA5E9 100%)" }}
        >
            <ArrowUp size={28} className="text-white" />
        </div>
    );
}
