import { Locale } from "../../utils/Language";
import ItemManager from "../../components/fields/ItemManager";

function formatExpiry(dateStr) {
    if (!dateStr) return "Unknown";
    const d = new Date(dateStr);
    const now = new Date();
    if (d <= now) return "Expired";
    const diff = d - now;
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    if (days > 0) return `${days}d ${hours}h remaining`;
    const mins = Math.floor((diff % 3600000) / 60000);
    return hours > 0 ? `${hours}h ${mins}m remaining` : `${mins}m remaining`;
}

export const TempRolesFeature = {
    name: {
        en: "Temporary Roles",
    },
    description: (
        <Locale
            en="Assign roles that automatically expire after a set duration. Manage temporary role assignments from this panel."
        />
    ),
    options: (values, { data }) => {
        const roleChoices = (data?.roles || []).map((r) => ({
            id: r.id,
            name: r.name,
            color: r.color,
            icon: "role",
        }));

        const tempRoles = values?.tempRoles || [];

        const columns = [
            { key: "userId", label: "User ID" },
            { key: "roleId", label: "Role", render: (v) => roleChoices.find((r) => r.id === v)?.name || v },
            { key: "expiresAt", label: "Expires", render: (v) => formatExpiry(v) },
        ];

        const formFields = [
            { id: "userId", label: "User ID", type: "string", required: true, placeholder: "123456789012345678", description: "The Discord user ID to assign the role to. Right-click a user → Copy User ID.", validate: (v) => { if (v && !/^\d{17,20}$/.test(v)) return "Must be a valid Discord user ID (17–20 digits)"; }, immutable: true },
            { id: "roleId", label: "Role", type: "role", required: true, choices: roleChoices, description: "The role to temporarily assign.", immutable: true },
            { id: "duration", label: "Duration", type: "duration", required: true, defaultValue: 3600000, description: "How long the role should last (1 min – 30 days).", duration: { duration: { baseUnit: "milliseconds", units: ["minutes", "hours", "days"], min: 60000, max: 30 * 24 * 60 * 60 * 1000 } } },
        ];

        return [
            {
                id: "_tempRolesManager",
                type: "preview",
                fullWidth: true,
                render: () => (
                    <ItemManager
                        featureId="temp_roles"
                        items={tempRoles}
                        columns={columns}
                        formFields={formFields}
                        itemLabel="Temporary Role"
                    />
                ),
            },
        ];
    },
};
