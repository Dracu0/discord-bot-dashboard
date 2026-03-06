import {createContext, useContext} from "react";
import {QueryHolderSkeleton} from "./components/AsyncContext";
import {getFeatures} from "api/internal";
import {GuildContext} from "./guild/GuildContext";
import {useQuery} from "@tanstack/react-query";

export const FeaturesContext = createContext({
    enabled: [],
  data: null,
  query: null,
});

export function FeaturesProvider({children}) {
    const {id: serverId} = useContext(GuildContext);
    const query = useQuery({
        queryKey: ["features", serverId],
        queryFn: () => getFeatures(serverId),
    enabled: Boolean(serverId),
        retry: 0
    })

  return (
    <FeaturesContext.Provider value={{
      ...query.data,
      data: query.data?.data || null,
      enabled: query.data?.enabled || [],
      query,
    }}>
      {children}
    </FeaturesContext.Provider>
  );
}

export function FeaturesGate({ children, height = 180, count = 4 }) {
  const { query } = useContext(FeaturesContext);

  if (!query) return children;

  return (
    <QueryHolderSkeleton query={query} height={height} count={count}>
      {children}
    </QueryHolderSkeleton>
  );
}