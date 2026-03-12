import { Locale } from "../../utils/Language";

export const MusicFeature = {
    name: {
        en: "Music Player",
    },
    canToggle: true,
    description: (
        <Locale
            en="Play music in voice channels. Configure a DJ role, default volume, and queue limits."
        />
    ),
    options: (values, { data }) => {
        const roleChoices = (data?.roles || []).map((r) => ({
            id: r.id,
            name: `@${r.name}`,
            icon: "role",
            color: r.color,
        }));

        return [
            {
                id: "musicDJRoleId",
                name: "DJ Role",
                description:
                    "Only members with this role can control playback (skip, stop, shuffle, etc.). Leave empty to allow everyone.",
                type: "id_enum",
                choices: roleChoices,
                element: { type: "role" },
                value: values.musicDJRoleId || "",
            },
            {
                id: "musicMaxQueueSize",
                name: "Max Queue Size",
                description:
                    "Maximum number of tracks allowed in the queue at once (1–500).",
                type: "number",
                value: values.musicMaxQueueSize ?? 100,
                validate: (v) => {
                    if (!Number.isInteger(v) || v < 1)
                        return "Queue size must be at least 1";
                    if (v > 500) return "Maximum queue size is 500";
                },
            },
        ];
    },
};
