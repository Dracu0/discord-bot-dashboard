import {createContext, useContext} from "react";
import {getActionsData} from "api/internal";
import {GuildContext} from "../guild/GuildContext";
import {useQuery} from "@tanstack/react-query";

export const ActionsDataContext = createContext({
    data: null,
    query: null,
})

export function ActionsDataProvider({children}) {
    const {id: serverId} = useContext(GuildContext);
    const query = useQuery({
        queryKey: ["actions", serverId],
        queryFn: () => getActionsData(serverId)
    })

    return <ActionsDataContext.Provider value={{
        data: query.data,
        query,
    }}>
            {children}
        </ActionsDataContext.Provider>
}