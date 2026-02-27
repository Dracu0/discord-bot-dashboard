import { Locale } from "../../utils/Language";

export const TicketsFeature = {
    name: {
        en: "Tickets",
    },
    canToggle: true,
    description: (
        <Locale
            en="Private support ticket system — users open tickets via a panel button or command, creating a private channel for staff to help."
        />
    ),
    options: (values, { data }) => {
        const channelChoices = (data?.channels || []).map((ch) => ({
            id: ch.id,
            name: `#${ch.name}`,
            icon: "channel",
        }));

        const roleChoices = (data?.roles || []).map((r) => ({
            id: r.id,
            name: r.name,
            icon: "role",
            color: r.color ? `#${r.color.toString(16).padStart(6, "0")}` : undefined,
        }));

        return [
            {
                id: "ticketCategoryId",
                name: "Ticket Category",
                description: "Category channel where new ticket channels are created",
                type: "id_enum",
                choices: channelChoices,
                element: { type: "channel" },
                value: values.ticketCategoryId || "",
            },
            {
                id: "ticketSupportRoleIds",
                name: "Support Roles",
                description: "Roles that can view and respond in ticket channels",
                type: "id_enum",
                choices: roleChoices,
                element: { type: "role" },
                multiple: true,
                value: values.ticketSupportRoleIds || [],
            },
            {
                id: "ticketLogChannelId",
                name: "Ticket Log Channel",
                description: "Channel where ticket open/close events are logged",
                type: "id_enum",
                choices: channelChoices,
                element: { type: "channel" },
                value: values.ticketLogChannelId || "",
            },
            {
                id: "ticketMaxOpen",
                name: "Max Open Tickets",
                description: "Maximum number of tickets a user can have open at once (default: 3)",
                type: "number",
                value: values.ticketMaxOpen ?? 3,
            },
        ];
    },
};
