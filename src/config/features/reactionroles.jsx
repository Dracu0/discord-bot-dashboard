import { Locale } from "../../utils/Language";
import ItemManager from "../../components/fields/ItemManager";

export const ReactionRolesFeature = {
    name: {
        en: "Reaction Roles",
    },
    description: (
        <Locale
            en="Configure self-assignable roles via message reactions. Add, edit, or remove reaction-role mappings below."
        />
    ),
    options: (values, { data }) => {
        const roleChoices = (data?.roles || []).map((r) => ({
            id: r.id,
            name: r.name,
            color: r.color,
            icon: "role",
        }));

        const channelChoices = (data?.channels || [])
            .filter((ch) => ch.type === 0 || ch.type === 5)
            .map((ch) => ({
                id: ch.id,
                name: `#${ch.name}`,
                icon: "channel",
            }));

        // Add synthetic _id based on index for ItemManager
        const items = (values.reactionRoles || []).map((rr, i) => ({
            _id: String(i),
            ...rr,
        }));

        const columns = [
            { key: "emoji", label: "Emoji" },
            { key: "roleId", label: "Role", render: (v) => roleChoices.find((r) => r.id === v)?.name || v },
            { key: "channelId", label: "Channel", render: (v) => channelChoices.find((c) => c.id === v)?.name || v },
            { key: "messageId", label: "Message ID" },
        ];

        const formFields = [
            { id: "channelId", label: "Channel", type: "channel", required: true, choices: channelChoices, description: "The channel containing the message." },
            { id: "messageId", label: "Message ID", type: "string", required: true, placeholder: "123456789012345678", description: "Right-click a message → Copy Message ID.", validate: (v) => { if (v && !/^\d{17,20}$/.test(v)) return "Must be a valid Discord ID (17–20 digits)"; } },
            { id: "emoji", label: "Emoji", type: "string", required: true, placeholder: "🎮 or a custom emoji", description: "The emoji users react with to receive the role." },
            { id: "roleId", label: "Role", type: "role", required: true, choices: roleChoices, description: "The role to assign when a member reacts." },
        ];

        return [
            {
                id: "_reactionRolesManager",
                type: "preview",
                fullWidth: true,
                render: () => (
                    <ItemManager
                        featureId="reaction_roles"
                        items={items}
                        columns={columns}
                        formFields={formFields}
                        itemLabel="Reaction Role"
                    />
                ),
            },
        ];
    },
};
