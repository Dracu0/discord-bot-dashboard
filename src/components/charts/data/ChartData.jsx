import { cn } from "lib/utils";
import { Calendar, BarChart3, CircleCheck, AlertTriangle } from "lucide-react";
import { Button } from "components/ui/button";
import Card from "components/card/Card";
import React from "react";
import ApexChart from "components/charts/ApexChart";

export default function ChartData({ name, description, value, time_unit, status, options, chartType }) {
    return (
        <Card className="flex flex-col w-full mb-0">
            <div className="flex justify-between ps-0 pe-5 pt-1">
                <div className="flex items-center w-full">
                    {time_unit && (
                        <Button
                            variant="secondary"
                            className="bg-(--surface-secondary) text-sm font-medium text-(--text-primary) rounded-[7px]"
                        >
                            <Calendar size={16} className="text-(--text-primary)" />
                            {time_unit}
                        </Button>
                    )}

                    <Button
                        variant="secondary"
                        size="icon"
                        className="ms-auto bg-(--surface-secondary) w-9.25 h-9.25 p-0 rounded-[10px]"
                    >
                        <BarChart3 size={24} className="text-(--accent-primary)" />
                    </Button>
                </div>
            </div>
            <div className="flex flex-col 2xl:flex-row w-full h-full">
                <div className="flex flex-col items-start text-start me-5 mt-7 gap-0">
                    <span
                        className={cn(
                            "text-(--text-primary) font-bold leading-none",
                            name.length <= 5 ? "text-[34px]" : "text-xl"
                        )}
                    >
                        {name}
                    </span>
                    <span className="text-(--text-secondary) text-sm font-medium mt-1 mb-8">
                        {description}
                    </span>

                    {status && (
                        <div className="flex items-center">
                            {status.success ? (
                                <>
                                    <CircleCheck size={18} className="text-green-500 mr-1" />
                                    <span className="text-green-500 text-base font-bold">
                                        {status.text}
                                    </span>
                                </>
                            ) : (
                                <>
                                    <AlertTriangle size={18} className="text-red-500 mr-1" />
                                    <span className="text-red-500 text-base font-bold">
                                        {status.text}
                                    </span>
                                </>
                            )}
                        </div>
                    )}
                </div>
                <div className="min-h-65 min-w-[75%] mt-auto">
                    <ApexChart
                        chartOptions={options}
                        chartData={value}
                        chartType={chartType}
                    />
                </div>
            </div>
        </Card>
    );
}
