import {createContext} from "react";
import {getAccountInfo} from "api/discord/DiscordApi";
import {QueryHolderSkeleton} from "./components/AsyncContext";
import {useQuery} from "@tanstack/react-query";

export const UserDataContext = createContext({});

export function UserDataProvider({children}) {
    const query = useQuery({
        queryKey: ["user_data"],
        queryFn: () => getAccountInfo(),
        refetchOnWindowFocus: false
    })

  return (
    <QueryHolderSkeleton query={query} height={300} count={1}>
      <UserDataContext.Provider value={query.data}>
        {children}
      </UserDataContext.Provider>
    </QueryHolderSkeleton>
  );
}
