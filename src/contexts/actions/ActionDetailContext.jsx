import {createContext, useState} from "react";
import {QueryHolderSkeleton} from "../components/AsyncContext";
import {useQuery} from "@tanstack/react-query";
import {useParams} from "react-router-dom";
import {getActionDetail} from "../../api/internal";
import {config} from "config/config";

export const ActionDetailContext = createContext({
    tasks: [],
    page: 1,
    totalPages: 1,
    total: 0,
    setPage: () => {},
})

export function ActionDetailProvider({children}) {
    const {id: guild, action} = useParams();
    const [page, setPage] = useState(1);
    const query = useQuery({
        queryKey: ["action_detail", guild, action, page],
        queryFn: () => getActionDetail(guild, action, page),
        placeholderData: (prev) => prev,
    })

    return <QueryHolderSkeleton query={query} count={2}>
        <ActionDetailContext.Provider value={{
            tasks: [],
            total: 0,
            totalPages: 1,
            ...query.data,
            page,
            setPage,
        }}>
            {children}
        </ActionDetailContext.Provider>
    </QueryHolderSkeleton>
}

export function useActionInfo() {
    const {action} = useParams()

    return config.actions[action]
}