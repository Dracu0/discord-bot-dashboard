import React, {createContext, useContext} from "react";
import {QueryHolder} from "../components/AsyncContext";
import {useQuery} from "@tanstack/react-query";
import {getServerDetails} from "../../api/internal";
import {GuildContext} from "./GuildContext";

export const GuildDetailContext = createContext({
    detail: null
})

export function ServerDetailProvider({children}) {
    const {id: serverId} = useContext(GuildContext)

    const query = useQuery({
        queryKey: ["server_detail", serverId],
        queryFn: () => getServerDetails(serverId)
    })

    return <QueryHolder query={query}>
        <GuildDetailContext.Provider value={{
            detail: query.data
        }}>
            {children}
        </GuildDetailContext.Provider>
    </QueryHolder>
}