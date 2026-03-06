import { Locale } from "../../utils/Language";

export const CustomCommandsFeature = {
    name: {
        en: "Custom Commands",
    },
    description: (
        <Locale
            en="Create custom text commands that members can trigger with the ! prefix. Use /customcommand in Discord to add, remove, or list commands."
        />
    ),
    options: (values) => {
        const commands = values?.customCommands || [];
        const entries = commands.map(
            (cmd) => `!${cmd.name} — ${cmd.response?.slice(0, 60) || "(no response)"}${cmd.response?.length > 60 ? "…" : ""}`
        );

        return [
            {
                id: "_customCommandsInfo",
                name: "Custom Commands",
                description: entries.length > 0
                    ? entries.join("\n")
                    : "No custom commands configured. Use `/customcommand add` in Discord to create them.",
                type: "boolean",
                value: commands.length > 0,
            },
        ];
    },
};
