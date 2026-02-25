import { Locale } from "utils/Language";

export const ManageSuggestionsAction = {
    name: {
        en: "Manage Suggestions",
    },
    description: (
        <Locale
            en="Review, approve, reject, or update pending suggestions submitted by server members."
        />
    ),
    options: (values) => [
        {
            id: "content",
            name: "Suggestion Content",
            description: "The text of the suggestion",
            type: "string",
            value: values ? values.content : "",
        },
        {
            id: "status",
            name: "Status",
            description: "Current status of the suggestion",
            type: "enum",
            choices: ["pending", "approved", "rejected", "in-progress"],
            multiple: false,
            value: values ? values.status : "pending",
        },
        {
            id: "reason",
            name: "Reason",
            description: "Reason for approval/rejection (optional)",
            type: "string",
            value: values ? values.reason : "",
        },
    ],
};
