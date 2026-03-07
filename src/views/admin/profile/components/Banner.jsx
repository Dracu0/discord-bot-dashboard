import { Avatar, AvatarImage, AvatarFallback } from "components/ui/avatar";
import Card from "components/card/Card";
import React from "react";
import { config } from "../../../../config/config";
import { Locale } from "../../../../utils/Language";

export default function Banner({ banner, avatar, name, joinedServers, servers }) {
    return (
        <Card variant="flush">
            <div
                className={`h-32 w-full rounded-t-[30px] bg-cover bg-center sm:h-36 ${
                    banner ? "" : "bg-[linear-gradient(135deg,var(--color-brand-500)_0%,var(--color-brand-400)_50%,var(--color-accent-400)_100%)]"
                }`}
                style={banner ? { backgroundImage: `url(${banner})` } : undefined}
            />
            <div className="flex flex-col items-center px-5 pb-6 md:px-6">
                <Avatar className="mx-auto -mt-11 h-22 w-22 border-4 border-(--surface-card) shadow-(--shadow-lg)">
                    <AvatarImage src={avatar} alt={name} />
                    <AvatarFallback>{name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <p className="mt-3 text-center font-['Space_Grotesk'] text-xl font-bold text-(--text-primary)">
                    {name}
                </p>
                <p className="text-center text-sm text-(--text-secondary)">
                    <Locale zh="歡迎回來" en="Welcome back to" /> {config.name}
                </p>
                <div className="mt-5 flex flex-wrap items-center justify-center gap-8">
                    {joinedServers != null && (
                        <Stat value={joinedServers} label={<Locale zh="已加入的伺服器" en="Joined Servers" />} />
                    )}
                    {servers != null && (
                        <Stat value={servers} label={<Locale zh="全部伺服器" en="Total Servers" />} />
                    )}
                </div>
            </div>
        </Card>
    );
}

function Stat({ value, label }) {
    return (
        <div className="flex flex-col items-center">
            <span className="font-['Space_Grotesk'] text-2xl font-bold text-(--accent-primary)">
                {value}
            </span>
            <span className="text-sm text-(--text-secondary)">{label}</span>
        </div>
    );
}
