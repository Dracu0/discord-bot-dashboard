export const DURATION_UNIT_OPTIONS = {
    milliseconds: {
        value: "milliseconds",
        label: "Milliseconds",
        shortLabel: "ms",
        ms: 1,
    },
    seconds: {
        value: "seconds",
        label: "Seconds",
        shortLabel: "sec",
        ms: 1000,
    },
    minutes: {
        value: "minutes",
        label: "Minutes",
        shortLabel: "min",
        ms: 60 * 1000,
    },
    hours: {
        value: "hours",
        label: "Hours",
        shortLabel: "hr",
        ms: 60 * 60 * 1000,
    },
    days: {
        value: "days",
        label: "Days",
        shortLabel: "day",
        ms: 24 * 60 * 60 * 1000,
    },
};

export function toMilliseconds(value, unit) {
    const unitDef = DURATION_UNIT_OPTIONS[unit] || DURATION_UNIT_OPTIONS.seconds;
    return Number(value || 0) * unitDef.ms;
}

export function fromMilliseconds(value, unit) {
    const unitDef = DURATION_UNIT_OPTIONS[unit] || DURATION_UNIT_OPTIONS.seconds;
    return Number(value || 0) / unitDef.ms;
}

export function toBaseDurationValue(value, baseUnit, displayUnit) {
    const milliseconds = toMilliseconds(value, displayUnit);
    return fromMilliseconds(milliseconds, baseUnit);
}

export function fromBaseDurationValue(value, baseUnit, displayUnit) {
    const milliseconds = toMilliseconds(value, baseUnit);
    return fromMilliseconds(milliseconds, displayUnit);
}

function isNearlyInteger(value) {
    return Math.abs(value - Math.round(value)) < 0.000001;
}

export function chooseDurationUnit(value, { baseUnit = "milliseconds", units = ["seconds", "minutes", "hours", "days"] } = {}) {
    const safeUnits = Array.isArray(units) && units.length ? units : ["seconds"];
    const numericValue = Number(value || 0);

    if (!numericValue) return safeUnits[0];

    const convertible = safeUnits.map((unit) => ({
        unit,
        value: fromBaseDurationValue(numericValue, baseUnit, unit),
    }));

    const integerCandidate = [...convertible]
        .reverse()
        .find((item) => item.value >= 1 && isNearlyInteger(item.value));

    if (integerCandidate) return integerCandidate.unit;

    const readableCandidate = [...convertible]
        .reverse()
        .find((item) => item.value >= 1);

    return readableCandidate?.unit || safeUnits[0];
}

export function formatDurationAmount(value) {
    if (!Number.isFinite(value)) return "0";
    const rounded = Math.round(value * 100) / 100;
    return Number.isInteger(rounded) ? String(rounded) : String(rounded);
}

export function formatDuration(value, {
    baseUnit = "milliseconds",
    units = ["seconds", "minutes", "hours", "days"],
    zeroLabel = "No cooldown",
} = {}) {
    const numericValue = Number(value || 0);
    if (!numericValue) return zeroLabel;

    const unit = chooseDurationUnit(numericValue, { baseUnit, units });
    const amount = fromBaseDurationValue(numericValue, baseUnit, unit);
    const rounded = Math.round(amount * 100) / 100;
    const unitLabel = rounded === 1
        ? (DURATION_UNIT_OPTIONS[unit]?.label || unit).replace(/s$/, "")
        : (DURATION_UNIT_OPTIONS[unit]?.label || unit);

    return `${formatDurationAmount(rounded)} ${unitLabel.toLowerCase()}`;
}