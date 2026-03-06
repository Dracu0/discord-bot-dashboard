import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "components/ui/tooltip";
import { Badge } from "components/ui/badge";
import { cn } from "lib/utils";

// -- Presentational wrappers for Storybook (no hooks) --

function ActiveUsersPresentation({ users }) {
    if (!users || users.length === 0) return null;
    return (
        <div className="flex items-center gap-1">
            <span className="text-xs text-(--text-secondary) mr-1">Online</span>
            <TooltipProvider>
                <div className="flex -space-x-2">
                    {users.slice(0, 5).map((u) => (
                        <Tooltip key={u.userId}>
                            <TooltipTrigger asChild>
                                <Avatar className="h-7 w-7 border-2 border-(--surface-primary)">
                                    <AvatarImage src={null} alt={u.username} />
                                    <AvatarFallback className="text-xs bg-blue-500 text-white">
                                        {u.username?.[0]?.toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                            </TooltipTrigger>
                            <TooltipContent>{`${u.username} � ${u.page || "?"}`}</TooltipContent>
                        </Tooltip>
                    ))}
                    {users.length > 5 && (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Avatar className="h-7 w-7 border-2 border-(--surface-primary)">
                                    <AvatarFallback className="text-xs bg-gray-500 text-white">
                                        +{users.length - 5}
                                    </AvatarFallback>
                                </Avatar>
                            </TooltipTrigger>
                            <TooltipContent>
                                {users.slice(5).map((u) => u.username).join(", ")}
                            </TooltipContent>
                        </Tooltip>
                    )}
                </div>
            </TooltipProvider>
        </div>
    );
}

function BotStatusPresentation({ status, ping }) {
    const STATUS_MAP = {
        online: { variant: "green", label: "Online" },
        idle: { variant: "yellow", label: "Idle" },
        dnd: { variant: "red", label: "Busy" },
        offline: { variant: "secondary", label: "Offline" },
        unknown: { variant: "secondary", label: "Status unknown" },
    };
    const cfg = STATUS_MAP[status] || STATUS_MAP.unknown;
    return (
        <div className="flex items-center gap-2">
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Badge variant={cfg.variant} className="cursor-default normal-case rounded-md text-xs font-semibold">
                            <span className={cn(
                                "w-1.5 h-1.5 rounded-full mr-1.5 inline-block",
                                status === "online" && "bg-emerald-500",
                                status === "idle" && "bg-amber-500",
                                status === "dnd" && "bg-red-500",
                                (!status || status === "offline" || status === "unknown") && "bg-gray-500",
                            )} />
                            {cfg.label}
                        </Badge>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                        {status && status !== "unknown"
                            ? (ping != null ? `Ping: ${ping}ms` : "Live status received")
                            : "Waiting for live bot telemetry"}
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    );
}

// -- Stories --

export default {
    title: "Dashboard/StatusIndicators",
};

export const BotOnline = () => <BotStatusPresentation status="online" ping={42} />;
export const BotIdle = () => <BotStatusPresentation status="idle" ping={120} />;
export const BotBusy = () => <BotStatusPresentation status="dnd" ping={300} />;
export const BotOffline = () => <BotStatusPresentation status="offline" />;
export const BotUnknown = () => <BotStatusPresentation status="unknown" />;

const sampleUsers = [
    { userId: "1", username: "Alice", avatar: null, page: "Dashboard" },
    { userId: "2", username: "Bob", avatar: null, page: "Welcome Config" },
    { userId: "3", username: "Charlie", avatar: null, page: "Mod Logs" },
];

const manyUsers = [
    ...sampleUsers,
    { userId: "4", username: "Diana", avatar: null, page: "Dashboard" },
    { userId: "5", username: "Eve", avatar: null, page: "Settings" },
    { userId: "6", username: "Frank", avatar: null, page: "Leaderboard" },
    { userId: "7", username: "Grace", avatar: null, page: "Analytics" },
];

export const ActiveUsersThree = () => <ActiveUsersPresentation users={sampleUsers} />;
export const ActiveUsersOverflow = () => <ActiveUsersPresentation users={manyUsers} />;
export const ActiveUsersEmpty = () => <ActiveUsersPresentation users={[]} />;
