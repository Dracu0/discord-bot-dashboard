import { cn } from "lib/utils";
import Card from "components/card/Card";
import PieChart from "components/charts/PieChart";
import React from "react";

export default function PieChartData({ name, data, options, unit }) {
    return (
        <Card className="flex items-center flex-col p-5 w-full">
            <div className="flex mb-12">
                <span className="text-[var(--text-primary)] text-lg font-bold mt-1">
                    {name}
                </span>
            </div>

            <div className="mx-auto max-w-full xl:max-w-[20rem]">
                <PieChart chartData={data} chartOptions={options} />
            </div>

            <div
                className={cn(
                    "grid gap-4 w-full py-4 px-5 mt-4 rounded-lg",
                    data.length >= 4
                        ? "grid-cols-2 md:grid-cols-3 2xl:grid-cols-4"
                        : data.length >= 3
                            ? "grid-cols-2 md:grid-cols-3"
                            : `grid-cols-${Math.min(data.length, 2)}`
                )}
            >
                {data.map((v, i) => (
                    <FooterItem key={i} label={options.labels[i]} value={v} unit={unit} />
                ))}
            </div>
        </Card>
    );
}

function FooterItem({ label, value, unit }) {
    return (
        <div className="flex items-center justify-center flex-col py-1">
            <div className="flex items-center">
                <div
                    className="h-2 w-2 rounded-full me-1"
                    style={{ backgroundColor: "var(--accent-primary)" }}
                />
                <span className="text-xs text-[var(--text-secondary)] font-bold mb-1">
                    {label}
                </span>
            </div>
            <span className="text-start text-lg text-[var(--text-primary)] font-bold">
                {value}{unit}
            </span>
        </div>
    );
}
