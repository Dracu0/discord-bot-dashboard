import { Avatar, AvatarImage, AvatarFallback } from "components/ui/avatar";
import { Card } from "components/ui/card";
import React from "react";
import { config } from "../../../../config/config";
import { Locale } from "../../../../utils/Language";

export default function Banner(props) {
    const { banner, avatar, name, joinedServers, servers } = props;

    return (
        <Card className="mb-0 lg:mb-5 items-center">
            <div
                className="w-full h-[140px]"
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
            <Avatar className="mx-auto w-[90px] h-[90px] -mt-[45px] border-4 border-[var(--surface-primary)] shadow-[var(--shadow-lg)]">
                <AvatarImage src={avatar} alt={name} />
                <AvatarFallback>{name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <p
                className="text-[var(--text-primary)] font-bold text-xl mt-3 text-center"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
                {name}
            </p>
            <p className="text-[var(--text-secondary)] text-sm text-center">
                <Locale zh="歡迎回到" en="Welcome back to" /> {config.name}
            </p>
            <div className="flex w-max mx-auto mt-[26px] flex-wrap gap-8">
                {joinedServers && (
                    <div className="flex items-center flex-col">
                        <span
                            className="text-[var(--accent-primary)] text-2xl font-bold"
                            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                        >
                            {joinedServers}
                        </span>
                        <span className="text-[var(--text-secondary)] text-sm font-normal">
                            <Locale zh="已加入的服務器" en="Joined Servers" />
                        </span>
                    </div>
                )}
                {servers && (
                    <div className="flex items-center flex-col">
                        <span
                            className="text-[var(--accent-primary)] text-2xl font-bold"
                            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                        >
                            {servers}
                        </span>
                        <span className="text-[var(--text-secondary)] text-sm font-normal">
                            <Locale zh="您擁有的服務器" en="Total Servers" />
                        </span>
                    </div>
                )}
            </div>
        </Card>
    );
}
