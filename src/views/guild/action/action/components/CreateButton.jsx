import { Button } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { Link, useParams } from "react-router-dom";
import React, { useContext } from "react";
import { GuildContext } from "contexts/guild/GuildContext";
import { Locale } from "utils/Language";

export default function CreateButton() {
    const { id: guild } = useContext(GuildContext);
    const { action } = useParams();

    return (
        <Button
            component={Link}
            to={`/guild/${guild}/actions/${action}/add`}
            color="brand"
            variant="filled"
            leftSection={<IconPlus size={16} />}
        >
            <Locale zh="創建新任務" en="New Task" />
        </Button>
    );
}