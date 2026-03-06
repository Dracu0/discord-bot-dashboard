import { useContext } from "react";
import { UserDataContext } from "contexts/UserDataContext";
import { Link } from "react-router-dom";
import { useLogout } from "../../api/internal";
import { Locale } from "../../utils/Language";
import {
    DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator,
} from "components/ui/dropdown-menu";

export default function UserOptionMenu() {
    const user = useContext(UserDataContext);
    const logout = useLogout();

    return (
        <DropdownMenuContent
            className="w-56 p-0"
            style={{
                borderRadius: "var(--radius-lg)",
                backgroundColor: "var(--surface-primary)",
                zIndex: 1500,
            }}
        >
            <div className="w-full mb-0">
                <span
                    className="block ps-5 pt-4 pb-2.5 w-full text-sm font-bold text-(--text-primary)"
                    style={{ borderBottom: "1px solid var(--border-subtle)" }}
                >
                    <Locale zh="\u6b61\u8fce" en="Welcome" />, {user.username}
                </span>
            </div>
            <div className="flex flex-col p-2.5">
                <DropdownMenuItem asChild className="rounded-lg px-3.5">
                    <Link to="/admin">
                        <Locale zh="\u500b\u4eba\u4fe1\u606f" en="Profile" />
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                    className="rounded-lg px-3.5 text-red-500 focus:text-red-500"
                    onClick={logout.mutate}
                    disabled={logout.isPending}
                >
                    <span className="text-sm">
                        <Locale zh="\u767b\u51fa" en="Log out" />
                    </span>
                </DropdownMenuItem>
            </div>
        </DropdownMenuContent>
    );
}
