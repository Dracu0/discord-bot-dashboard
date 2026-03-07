import React from "react";
import MetricCard from "components/card/MetricCard";

export default function InsightMetricCard({ icon, label, value, helper, tone = "default" }) {
    return (
        <MetricCard
            icon={icon}
            label={label}
            value={value}
            detail={helper}
            tone={tone}
        />
    );
}
