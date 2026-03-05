import React, { useContext, useState, useRef, useEffect } from "react";
import { GuildContext } from "../../contexts/guild/GuildContext";
import { useQuery } from "@tanstack/react-query";
import { getNotifications } from "../../api/internal";
import { Bell } from "lucide-react";
import { Locale } from "../../utils/Language";
import { QueryHolderSkeleton } from "../../contexts/components/AsyncContext";
import { NotificationItem } from "./NotificationItem";
import { Badge } from "components/ui/badge";

export function Notifications() {
    const [opened, setOpened] = useState(false);
    const menuRef = useRef(null);

    const { id: serverId } = useContext(GuildContext);

    const query = useQuery({
        queryKey: ["notifications", serverId],
        queryFn: () => getNotifications(serverId),
        staleTime: 60_000,
        refetchInterval: 60_000,
    });

    const count = query.data?.length ?? 0;

    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpened(false);
            }
        }
        if (opened) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [opened]);

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setOpened(p => !p)}
                className="p-0 bg-transparent border-none cursor-pointer relative"
                aria-label="Notifications"
            >
                {count > 0 && (
                    <span className="absolute -top-1 -right-1.5 flex items-center justify-center min-w-[16px] h-4 rounded-full bg-red-500 text-white text-[10px] font-bold px-1 z-10">
                        {count}
                    </span>
                )}
                <Bell size={20} className="text-[var(--text-secondary)]" />
            </button>
            {opened && (
                <div
                    className="absolute right-0 top-full mt-2 w-[400px] p-5 z-[1500]"
                    style={{
                        borderRadius: "var(--radius-lg)",
                        backgroundColor: "var(--surface-primary)",
                        border: "1px solid var(--border-default)",
                        boxShadow: "var(--shadow-lg)",
                    }}
                >
                    <span className="w-full mb-5 block text-base font-semibold text-[var(--text-primary)]">
                        <Locale zh="\u901a\u77e5" en="Notifications" />
                        {count > 0 && (
                            <Badge variant="blue" className="ml-2 rounded-full">{count}</Badge>
                        )}
                    </span>
                    <div className="flex flex-col gap-3">
                        <QueryHolderSkeleton query={query} height="100px" count={2}>
                            {() =>
                                query.data && query.data.length > 0
                                    ? query.data.map((item, key) => (
                                        <div key={key} className="rounded-lg p-0 cursor-pointer hover:bg-[var(--surface-secondary)] transition-colors">
                                            <div className="flex items-center">
                                                <NotificationItem {...item} />
                                            </div>
                                        </div>
                                    ))
                                    : <span className="text-sm text-[var(--text-secondary)] text-center py-4 block">
                                        <Locale zh="\u66ab\u7121\u901a\u77e5" en="No notifications" />
                                    </span>
                            }
                        </QueryHolderSkeleton>
                    </div>
                </div>
            )}
        </div>
    );
}
