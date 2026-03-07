import { Avatar, AvatarImage, AvatarFallback } from "components/ui/avatar";
import Card from "components/card/Card";
import React from "react";
import { config } from "../../../../config/config";
import { Locale } from "../../../../utils/Language";

export default function Banner(props) {
    const { banner, avatar, name, joinedServers, servers } = props;

    return (
        <Card className="mb-0 lg:mb-5 items-center">
            <div
                className="w-full h-35"
                style={{
                    borderRadius: "var(--radius-lg)",
                    backgroundImage: banner ? `url(${banner})` : undefined,
                    background: !banner
                        ? "linear-gradient(135deg, var(--color-brand-500) 0%, var(--color-brand-400) 50%, var(--color-accent-400) 100%)"
                        : undefined,
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                }}
            />
            <Avatar className="mx-auto w-22.5 h-22.5 -mt-11.25 border-4 border-(--surface-primary) shadow-(--shadow-lg)">
                <AvatarImage src={avatar} alt={name} />
                <AvatarFallback>{name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <p
                className="text-(--text-primary) font-bold text-xl mt-3 text-center"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
                {name}
            </p>
            <p className="text-(--text-secondary) text-sm text-center">
                <Locale zh="\u6B61\u8FCE\u56DE\u4F86" en="Welcome back to" /> {config.name}
            </p>
            <div className="flex w-max mx-auto mt-6.5 flex-wrap gap-8">
                {joinedServers && (
                    <div className="flex items-center flex-col">
                        <span
                            className="text-(--accent-primary) text-2xl font-bold"
                            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                        >
                            {joinedServers}
                        </span>
                        <span className="text-(--text-secondary) text-sm font-normal">
                            <Locale zh="\u5DF2\u52A0\u5165\u7684\u4F3A\u670D\u5668" en="Joined Servers" />
                        </span>
                    </div>
                )}
                {servers && (
                    <div className="flex items-center flex-col">
                        <span
                            className="text-(--accent-primary) text-2xl font-bold"
                            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                        >
                            {servers}
                        </span>
                        <span className="text-(--text-secondary) text-sm font-normal">
                            <Locale zh="\u5168\u90E8\u4F3A\u670D\u5668" en="Total Servers" />
                        </span>
                    </div>
                )}
            </div>
        </Card>
    );
}
