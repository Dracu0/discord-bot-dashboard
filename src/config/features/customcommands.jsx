import { Locale } from "../../utils/Language";
import ItemManager from "../../components/fields/ItemManager";

const columns = [
    { key: "name", label: "Command", render: (v) => `!${v}` },
    { key: "response", label: "Response", render: (v) => v?.length > 60 ? v.slice(0, 60) + "…" : v },
    { key: "ephemeral", label: "Ephemeral", render: (v) => v ? "Yes" : "No" },
];

const formFields = [
    { id: "name", label: "Command Name", type: "string", required: true, placeholder: "hello", description: "Lowercase letters, numbers, hyphens, and underscores only (max 32).", validate: (v) => { if (v && !/^[a-z0-9_-]+$/.test(v)) return "Only lowercase letters, numbers, hyphens, and underscores"; if (v && v.length > 32) return "Max 32 characters"; }, immutable: true },
    { id: "response", label: "Response Text", type: "long_string", required: true, description: "The message the bot replies with (max 2000 chars).", validate: (v) => { if (v && v.length > 2000) return "Max 2000 characters"; } },
    { id: "description", label: "Description", type: "string", placeholder: "A short description for the command list", description: "Optional description shown in the slash command list (max 100)." },
    { id: "ephemeral", label: "Ephemeral (only visible to caller)", type: "boolean", defaultValue: false },
];

export const CustomCommandsFeature = {
    name: {
        en: "Custom Commands",
    },
    description: (
        <Locale
            en="Create custom text commands that members can trigger. Manage all commands directly from this panel."
        />
    ),
    options: (values) => {
        const commands = values?.customCommands || [];

        return [
            {
                id: "_customCommandsManager",
                type: "preview",
                fullWidth: true,
                render: () => (
                    <ItemManager
                        featureId="custom_commands"
                        items={commands}
                        columns={columns}
                        formFields={formFields}
                        itemLabel="Custom Command"
                    />
                ),
            },
        ];
    },
};
