import { ApolloQueryResult, useQuery } from "@apollo/client";
import { createContext, useEffect } from "react";

import { MeDocument, MePartsFragment, MeQuery } from "../graphql/generated/graphql";
import { useStytchUser } from "@stytch/react";
import { Exact } from "utility-types/dist/mapped-types";

interface CurrentUserContextValue {
  me: MePartsFragment | undefined | null;
  meLoading: boolean;
  refetch:
    | null
    | undefined
    | ((
        variables?:
          | Partial<
              Exact<{
                [key: string]: never;
              }>
            >
          | undefined,
      ) => Promise<ApolloQueryResult<MeQuery>>);
}

export const CurrentUserContext = createContext<CurrentUserContextValue>({
  me: null,
  meLoading: false,
  refetch: null,
});

export const CurrentUserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useStytchUser();

  const { data, loading: meLoading, refetch } = useQuery(MeDocument);
  const me = data?.me;
  useEffect(() => {
    refetch();
  }, [user, refetch]);

  return (
    <CurrentUserContext.Provider value={{ me, meLoading, refetch }}>
      {children}
    </CurrentUserContext.Provider>
  );
};
