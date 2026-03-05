import React, { useContext } from "react";
import { Button } from "components/ui/button";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
} from "components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "components/ui/avatar";
import { useDisclosure } from "hooks/useDisclosure";
import UserOptionMenu from "components/menu/UserOptionMenu";
import { SearchBar } from "components/navbar/searchBar/SearchBar";
import { SidebarResponsive } from "components/sidebar/Sidebar";
import { Moon, Sun, Settings } from "lucide-react";
import { UserDataContext } from "contexts/UserDataContext";
import { PageInfoContext } from "contexts/PageInfoContext";
import { SettingsContext } from "contexts/SettingsContext";
import { avatarToUrl } from "api/discord/DiscordApi";
import { SettingsModal } from "../modal/SettingsModal";
import { Notifications } from "../menu/Notifications";

const ICON_BTN = 36;

export default function HeaderLinks() {
    const { colorScheme, updateSettings } = useContext(SettingsContext);
    const { routes } = useContext(PageInfoContext);
    const isDark = colorScheme === "dark";

    return (
        <>
            <SearchBar className="me-2.5" />
            <SidebarResponsive routes={routes} />
            <div className="flex items-center gap-1.5">
                <Notifications />
                <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full"
                    style={{ width: ICON_BTN, height: ICON_BTN, transition: "transform 0.2s ease" }}
                    onClick={() => updateSettings({ colorScheme: isDark ? "light" : "dark" })}
                    aria-label="Toggle color scheme"
                >
                    {isDark ? <Sun size={18} /> : <Moon size={18} />}
                </Button>
                <SettingsMenu />
                <UserMenu />
            </div>
        </>
    );
}

function SettingsMenu() {
    const [opened, { close, open }] = useDisclosure(false);

    return (
        <>
            <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                style={{ width: ICON_BTN, height: ICON_BTN }}
                aria-label="Settings"
                onClick={open}
            >
                <Settings size={18} />
            </Button>
            <SettingsModal isOpen={opened} onClose={close} />
        </>
    );
}

function UserMenu() {
    const { username, avatar, id } = useContext(UserDataContext);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-1.5 cursor-pointer">
                    <Avatar
                        className="h-8 w-8"
                        style={{ border: "2px solid var(--accent-primary)" }}
                    >
                        <AvatarImage src={avatarToUrl(id, avatar)} alt={username} />
                        <AvatarFallback>{username?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span
                        className="hidden lg:inline text-sm font-semibold"
                        style={{ color: "var(--text-primary)" }}
                    >
                        {username}
                    </span>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
                <UserOptionMenu />
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
