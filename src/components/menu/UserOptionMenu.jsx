import { useContext } from "react";
import { UserDataContext } from "contexts/UserDataContext";
import { Link } from "react-router-dom";
import { useLogout } from "../../api/internal";
import { Locale } from "../../utils/Language";
import { Avatar, AvatarFallback, AvatarImage } from "components/ui/avatar";
import { avatarToUrl } from "api/discord/DiscordApi";
import { LogOut, UserCircle2 } from "lucide-react";
import {
    DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator,
} from "components/ui/dropdown-menu";

export default function UserOptionMenu() {
    const user = useContext(UserDataContext);
    const logout = useLogout();

    return (
        <DropdownMenuContent
            align="end"
            className="w-[18rem] overflow-hidden rounded-3xl border border-(--border-default) bg-(--surface-card) p-0 shadow-(--shadow-lg)"
        >
            <div className="border-b border-(--border-subtle) bg-[linear-gradient(180deg,var(--surface-card)_0%,var(--surface-primary)_100%)] px-4 py-4">
                <div className="flex items-center gap-3">
                    <Avatar className="h-11 w-11 border border-(--border-subtle)">
                        <AvatarImage src={avatarToUrl(user.id, user.avatar)} alt={user.username} />
                        <AvatarFallback>{user.username?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                        <span className="block truncate font-['Space_Grotesk'] text-base font-semibold text-(--text-primary)">
                            {user.username}
                        </span>
                        <span className="block text-xs uppercase tracking-[0.14em] text-(--text-muted)">
                            <Locale zh="\u6b61\u8fce\u56de\u4f86" en="Account menu" />
                        </span>
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-1.5 p-2.5">
                <DropdownMenuItem asChild className="rounded-2xl px-3.5 py-2.5">
                    <Link to="/admin">
                        <UserCircle2 size={16} />
                        <Locale zh="\u500b\u4eba\u4fe1\u606f" en="Profile" />
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="mx-1 my-1" />
                <DropdownMenuItem
                    className="rounded-2xl px-3.5 py-2.5 text-red-400 focus:text-red-300"
                    onClick={logout.mutate}
                    disabled={logout.isPending}
                >
                    <LogOut size={16} />
                    <span className="text-sm"><Locale zh="\u767b\u51fa" en="Log out" /></span>
                </DropdownMenuItem>
            </div>
        </DropdownMenuContent>
    );
}
