import { Locale } from "../../utils/Language";

export const TempRolesFeature = {
    name: {
        en: "Temporary Roles",
    },
    description: (
        <Locale
            en="Assign roles that automatically expire after a set duration. Use /temprole in Discord to assign, remove, or list temporary roles."
        />
    ),
    options: (values, { data }) => {
        const roleChoices = (data?.roles || []).map((r) => ({
            id: r.id,
            name: r.name,
        }));

        const entries = (values.tempRoles || []).map((tr) => {
            const roleName = roleChoices.find((r) => r.id === tr.roleId)?.name || tr.roleId;
            const expires = tr.expiresAt ? new Date(tr.expiresAt).toLocaleString() : "Unknown";
            return `<@${tr.userId}> — ${roleName} — expires ${expires}`;
        });

        return [
            {
                id: "_tempRolesInfo",
                name: "Active Temporary Roles",
                description: entries.length > 0
                    ? entries.join("\n")
                    : "No active temporary roles. Use `/temprole assign` in Discord to create them.",
                type: "boolean",
                value: entries.length > 0,
            },
        ];
    },
};
