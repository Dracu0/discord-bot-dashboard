import React from "react";
import { Badge } from "components/ui/badge";

const toneBadge = {
    success: "success",
    warning: "warning",
    neutral: "secondary",
};

export default function HealthListItem({ title, value, tone = "neutral", helper }) {
    return (
        <div className="rounded-2xl border border-(--border-subtle) bg-(--surface-card) px-4 py-3.5 shadow-(--shadow-xs)">
            <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-medium tracking-tight text-(--text-primary)">{title}</span>
                <Badge variant={toneBadge[tone] || "secondary"}>{value}</Badge>
            </div>
            {helper ? <p className="mt-2 text-sm leading-6 text-(--text-secondary)">{helper}</p> : null}
        </div>
    );
}
