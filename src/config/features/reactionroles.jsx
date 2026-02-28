import { Locale } from "../../utils/Language";

export const ReactionRolesFeature = {
    name: {
        en: "Reaction Roles",
    },
    description: (
        <Locale
            en="Configure self-assignable roles via message reactions. Use the /reactionrole command in Discord to add or remove reaction-role mappings."
        />
    ),
    options: (values, { data }) => {
        const roleChoices = (data?.roles || []).map((r) => ({
            id: r.id,
            name: r.name,
            color: r.color,
            icon: "role",
        }));

        const channelChoices = (data?.channels || []).map((ch) => ({
            id: ch.id,
            name: `#${ch.name}`,
            icon: "channel",
        }));

        // Build a readable list from the stored reaction roles
        const entries = (values.reactionRoles || []).map((rr) => {
            const roleName = roleChoices.find((r) => r.id === rr.roleId)?.name || rr.roleId;
            const channelName = channelChoices.find((c) => c.id === rr.channelId)?.name || rr.channelId;
            return `${rr.emoji} → ${roleName} (in ${channelName})`;
        });

        return [
            {
                id: "_reactionRolesInfo",
                name: "Current Reaction Roles",
                description: entries.length > 0
                    ? entries.join("\n")
                    : "No reaction roles configured. Use `/reactionrole add` in Discord to set them up.",
                type: "boolean",
                value: (values.reactionRoles || []).length > 0,
            },
        ];
    },
};
