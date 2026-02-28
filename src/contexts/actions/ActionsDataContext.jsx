import {createContext, useContext} from "react";
import {QueryHolder} from "../components/AsyncContext";
import {getActionsData} from "api/internal";
import {GuildContext} from "../guild/GuildContext";
import {useQuery} from "@tanstack/react-query";

export const ActionsDataContext = createContext({})

export function ActionsDataProvider({children}) {
    const {id: serverId} = useContext(GuildContext);
    const query = useQuery({
        queryKey: ["actions", serverId],
        queryFn: () => getActionsData(serverId)
    })

    return <QueryHolder query={query}>
        <ActionsDataContext.Provider value={query.data}>
            {children}
        </ActionsDataContext.Provider>
    </QueryHolder>
}