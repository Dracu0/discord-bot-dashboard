import React, { useEffect, useMemo, useState } from "react";

import { InputField } from "./InputField";
import { SelectField } from "components/fields/SelectField";
import { cn } from "lib/utils";
import {
    chooseDurationUnit,
    DURATION_UNIT_OPTIONS,
    formatDuration,
    formatDurationAmount,
    fromBaseDurationValue,
    toBaseDurationValue,
} from "utils/duration";

export default function DurationField({ value, onChange, option, error }) {
    const duration = option.duration || {};
    const baseUnit = duration.baseUnit || "milliseconds";
    const units = duration.units || ["seconds", "minutes", "hours", "days"];
    const [selectedUnit, setSelectedUnit] = useState(() => chooseDurationUnit(value, { baseUnit, units }));

    useEffect(() => {
        if (!units.includes(selectedUnit)) {
            setSelectedUnit(chooseDurationUnit(value, { baseUnit, units }));
        }
    }, [baseUnit, selectedUnit, units, value]);

    const displayValue = useMemo(
        () => formatDurationAmount(fromBaseDurationValue(value || 0, baseUnit, selectedUnit)),
        [baseUnit, selectedUnit, value]
    );

    const unitOptions = useMemo(
        () => units.map((unit) => ({
            value: unit,
            label: DURATION_UNIT_OPTIONS[unit]?.label || unit,
        })),
        [units]
    );

    const summary = formatDuration(value || 0, {
        baseUnit,
        units,
        zeroLabel: duration.zeroLabel || "No cooldown",
    });

    const minSummary = duration.min != null
        ? formatDuration(duration.min, { baseUnit, units, zeroLabel: duration.zeroLabel || "No cooldown" })
        : null;
    const maxSummary = duration.max != null
        ? formatDuration(duration.max, { baseUnit, units, zeroLabel: duration.zeroLabel || "No cooldown" })
        : null;

    const handleAmountChange = ({ target }) => {
        const nextText = target.value;
        if (nextText === "") {
            onChange(0);
            return;
        }

        const numericValue = Number(nextText);
        if (!Number.isFinite(numericValue)) {
            onChange(0);
            return;
        }

        const nextBaseValue = Math.round(toBaseDurationValue(numericValue, baseUnit, selectedUnit));
        onChange(nextBaseValue);
    };

    return (
        <div className="space-y-2">
            <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_160px]">
                <InputField
                    type="number"
                    min={0}
                    step="any"
                    value={displayValue}
                    onChange={handleAmountChange}
                    error={error}
                />
                <SelectField
                    value={selectedUnit}
                    onChange={setSelectedUnit}
                    options={unitOptions}
                />
            </div>

            <div className={cn("text-xs leading-5 text-(--text-muted)", error && "text-(--status-error)")}>
                <div>Current value: {summary}</div>
                {(minSummary || maxSummary) && (
                    <div>
                        Range: {minSummary || "0"} to {maxSummary || "No limit"}
                    </div>
                )}
            </div>
        </div>
    );
}