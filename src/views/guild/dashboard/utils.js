export function clampPercentage(value) {
    if (!Number.isFinite(value)) return 0;
    return Math.max(0, Math.min(100, Math.round(value)));
}

export function toTitleLabel(value) {
    return String(value || "")
        .replace(/[._-]+/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function shortenDiscordId(value) {
    if (!value) return "—";
    const text = String(value);
    if (text.length <= 10) return text;
    return `${text.slice(0, 4)}…${text.slice(-4)}`;
}

export function getModerationTone(action) {
    const normalized = String(action || "").toLowerCase();

    if (["ban", "kick"].includes(normalized)) {
        return { badge: "destructive", dot: "bg-rose-400" };
    }

    if (["mute", "timeout"].includes(normalized)) {
        return { badge: "warning", dot: "bg-orange-400" };
    }

    if (["warn"].includes(normalized)) {
        return { badge: "secondary", dot: "bg-amber-300" };
    }

    return { badge: "outline", dot: "bg-(--accent-primary)" };
}

export function formatRecentActionTime(value) {
    if (!value) {
        return "—";
    }

    const now = Date.now();
    const diffMinutes = Math.max(0, Math.round((now - value) / 60000));

    if (diffMinutes < 1) return "Now";
    if (diffMinutes < 60) return `${diffMinutes}m ago`;

    const diffHours = Math.round(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;

    const diffDays = Math.round(diffHours / 24);
    return `${diffDays}d ago`;
}

export function formatActionDate(value) {
    if (!value) return "—";
    return new Date(value).toLocaleDateString();
}

export function formatActionClock(value) {
    if (!value) return "";
    return new Date(value).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
