import {createContext, useContext} from "react";
import {QueryHolderSkeleton} from "./components/AsyncContext";
import {getFeatures} from "api/internal";
import {GuildContext} from "./guild/GuildContext";
import {useQuery} from "@tanstack/react-query";

export const FeaturesContext = createContext({
    enabled: [],
    data: null
});

export function FeaturesProvider({children}) {
    const {id: serverId} = useContext(GuildContext);
    const query = useQuery({
        queryKey: ["features", serverId],
        queryFn: () => getFeatures(serverId),
        retry: 0
    })

  return (
    <QueryHolderSkeleton query={query} height={180} count={4}>
        <FeaturesContext.Provider value={query.data}>
          {children}
        </FeaturesContext.Provider>
    </QueryHolderSkeleton>
  );
}