import React from "react";
import MetricCard from "components/card/MetricCard";

const toneIconClass = {
    default: "text-(--accent-primary)",
    accent: "text-sky-400",
    success: "text-emerald-400",
    warning: "text-orange-400",
};

export default function InsightMetricCard({ icon, label, value, helper, tone = "default" }) {
    return (
        <MetricCard
            icon={icon}
            label={label}
            value={value}
            detail={helper}
            tone={tone}
            className="rounded-2xl shadow-(--shadow-xs)"
            iconContainerClassName={toneIconClass[tone] || toneIconClass.default}
        />
    );
}
