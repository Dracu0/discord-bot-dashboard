import React from "react";
import { clampPercentage } from "../utils";

const barTone = {
    default: "bg-[linear-gradient(90deg,var(--accent-primary),color-mix(in_srgb,var(--accent-primary)_65%,white))]",
    accent: "bg-[linear-gradient(90deg,#38bdf8,#818cf8)]",
    success: "bg-[linear-gradient(90deg,#34d399,#10b981)]",
    warning: "bg-[linear-gradient(90deg,#fb923c,#f97316)]",
};

export default function MissionSignal({ label, value, helper, progress = 0, tone = "default" }) {
    return (
        <div className="rounded-2xl border border-(--border-subtle) bg-(--surface-card) px-4 py-3.5 shadow-(--shadow-xs)">
            <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold tracking-tight text-(--text-primary)">{label}</p>
                <span className="font-['Space_Grotesk'] text-base font-semibold tracking-tight text-(--text-primary)">{value}</span>
            </div>
            {helper ? <p className="mt-1.5 text-sm leading-6 text-(--text-secondary)">{helper}</p> : null}
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-(--surface-secondary)" aria-hidden="true">
                <div
                    className={`h-full rounded-full ${barTone[tone] || barTone.default}`}
                    style={{ width: `${clampPercentage(progress)}%` }}
                />
            </div>
        </div>
    );
}
