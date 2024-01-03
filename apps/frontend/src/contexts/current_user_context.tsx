import { useQuery } from "@apollo/client";
import { createContext, useEffect } from "react";

import { MeDocument, MePartsFragment } from "../graphql/generated/graphql";
import { useStytchUser } from "@stytch/react";

interface CurrentUserContextValue {
  me: MePartsFragment | undefined | null;
  meLoading: boolean;
}

export const CurrentUserContext = createContext<CurrentUserContextValue>({
  me: null,
  meLoading: false,
});

export const CurrentUserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useStytchUser();

  const { data, loading: meLoading, refetch } = useQuery(MeDocument);
  const me = data?.me;

  useEffect(() => {
    refetch();
  }, [user, refetch]);

  return (
    <CurrentUserContext.Provider value={{ me: me, meLoading }}>
      {children}
    </CurrentUserContext.Provider>
  );
};
