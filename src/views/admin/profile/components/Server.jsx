import { Avatar, AvatarImage, AvatarFallback } from "components/ui/avatar";
import { Badge } from "components/ui/badge";
import { Button } from "components/ui/button";
import Card from "components/card/Card";
import { Link } from "react-router-dom";
import React from "react";
import { iconToUrl } from "api/discord/DiscordApi";
import { Locale } from "utils/Language";

export default function Server({ server, ...rest }) {
    const { name, id, icon } = server;

    return (
        <Card className="p-4" {...rest}>
            <div className="flex items-center flex-col md:flex-row gap-4">
                <Avatar className="w-14 h-14 sm:w-20 sm:h-20 shrink-0 rounded-md">
                    <AvatarImage src={icon && iconToUrl(id, icon)} alt={name} />
                    <AvatarFallback className="rounded-md text-lg">
                        {name?.charAt(0)}
                    </AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-2 items-center md:items-start flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap justify-center md:justify-start">
                        <span
                            className="text-(--text-primary) font-semibold text-lg truncate"
                            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                        >
                            {name}
                        </span>
                        {server.exist && (
                            <Badge variant="green">
                                <Locale zh="\u5DF2\u52A0\u5165" en="Joined" />
                            </Badge>
                        )}
                    </div>
                    {server.exist ? <ConfigButton server={server} /> : <InviteButton />}
                </div>
            </div>
        </Card>
    );
}

function InviteButton() {
    return (
        <Button variant="outline" size="sm" asChild>
            <Link to="/invite" target="_blank">
                <Locale zh="\u9080\u8ACB\u5230\u4F3A\u670D\u5668" en="Invite to Server" />
            </Link>
        </Button>
    );
}

function ConfigButton({ server }) {
    return (
        <Button variant="default" size="sm" asChild>
            <Link to={`/guild/${server.id}`}>
                <Locale zh="\u81EA\u5B9A\u7FA9\u8A2D\u5B9A" en="Customize" />
            </Link>
        </Button>
    );
}
