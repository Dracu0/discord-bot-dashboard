import { Avatar, Group, ActionIcon, Menu, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useMantineColorScheme } from "@mantine/core";
import UserOptionMenu from "components/menu/UserOptionMenu";
import { SearchBar } from "components/navbar/searchBar/SearchBar";
import { SidebarResponsive } from "components/sidebar/Sidebar";
import React, { useContext } from "react";
import { IconMoon, IconSun, IconSettings } from "@tabler/icons-react";
import { UserDataContext } from "contexts/UserDataContext";
import { PageInfoContext } from "contexts/PageInfoContext";
import { avatarToUrl } from "api/discord/DiscordApi";
import { SettingsModal } from "../modal/SettingsModal";
import { Notifications } from "../menu/Notifications";
import { useTextColor } from "../../utils/colors";

export default function HeaderLinks() {
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const { routes } = useContext(PageInfoContext);

    return (
        <>
            <SearchBar me={10} />
            <SidebarResponsive routes={routes} />
            <Group gap="xs">
                <Notifications />
                <ActionIcon
                    variant="subtle"
                    color="gray"
                    radius="xl"
                    onClick={toggleColorScheme}
                    aria-label="Dark Mode"
                >
                    {colorScheme === "light" ? <IconMoon size={18} /> : <IconSun size={18} />}
                </ActionIcon>
                <SettingsMenu />
                <UserMenu />
            </Group>
        </>
    );
}

function SettingsMenu() {
    const [opened, { close, open }] = useDisclosure(false);

    return <>
        <ActionIcon
            variant="subtle"
            color="gray"
            radius="xl"
            aria-label="Settings"
            onClick={open}
        >
            <IconSettings size={18} />
        </ActionIcon>
        <SettingsModal isOpen={opened} onClose={close} />
    </>
}

function UserMenu() {
    const { username, avatar, id } = useContext(UserDataContext);
    const textColor = useTextColor();

    return (
        <Menu shadow="md" width={200}>
            <Menu.Target>
                <Group gap="xs" style={{ cursor: 'pointer' }}>
                    <Avatar
                        name={username}
                        src={avatarToUrl(id, avatar)}
                        color="brand"
                        size="sm"
                        radius="xl"
                        style={{ border: '2px solid var(--mantine-color-brand-4)' }}
                    />
                    <Text visibleFrom="lg" c={textColor} fz="sm" fw={600}>
                        {username}
                    </Text>
                </Group>
            </Menu.Target>
            <UserOptionMenu />
        </Menu>
    );
}