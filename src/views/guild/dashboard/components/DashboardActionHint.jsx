import React from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Locale } from "utils/Language";
import { Badge } from "components/ui/badge";

const iconTone = {
    neutral: "text-(--accent-primary)",
    warning: "text-orange-400",
    success: "text-emerald-400",
};

const badgeTone = {
    neutral: "secondary",
    warning: "warning",
    success: "success",
};

export default function DashboardActionHint({ to, icon, title, description, badge, tone = "neutral" }) {
    return (
        <Link to={to} className="block rounded-3xl border border-(--border-subtle) bg-(--surface-primary) p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-(--border-default) hover:shadow-(--shadow-sm)">
            <div className="flex items-start gap-3">
                <div className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-(--surface-secondary) ${iconTone[tone] || iconTone.neutral}`}>
                    {icon}
                </div>
                <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                        <h3 className="font-['Space_Grotesk'] text-sm font-semibold text-(--text-primary)">{title}</h3>
                        {badge ? <Badge variant={badgeTone[tone] || "secondary"}>{badge}</Badge> : null}
                    </div>
                    <p className="mt-1 text-sm leading-6 text-(--text-secondary)">{description}</p>
                    <div className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-(--accent-primary)">
                        <Locale zh="打開區塊" en="Open section" />
                        <ArrowRight className="h-4 w-4" />
                    </div>
                </div>
            </div>
        </Link>
    );
}
