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
        <Card variant="interactive" className="p-4 md:p-5" {...rest}>
            <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12 shrink-0 rounded-xl sm:h-14 sm:w-14">
                    <AvatarImage src={icon && iconToUrl(id, icon)} alt={name} />
                    <AvatarFallback className="rounded-xl text-base">
                        {name?.charAt(0)}
                    </AvatarFallback>
                </Avatar>
                <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="truncate font-['Space_Grotesk'] text-base font-semibold text-(--text-primary) sm:text-lg">
                            {name}
                        </span>
                        {server.exist && (
                            <Badge variant="green">
                                <Locale zh="已加入" en="Joined" />
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
        <Button variant="outline" size="sm" className="w-fit" asChild>
            <Link to="/invite" target="_blank">
                <Locale zh="邀請到伺服器" en="Invite to Server" />
            </Link>
        </Button>
    );
}

function ConfigButton({ server }) {
    return (
        <Button variant="default" size="sm" className="w-fit" asChild>
            <Link to={`/guild/${server.id}`}>
                <Locale zh="自定義設定" en="Customize" />
            </Link>
        </Button>
    );
}
