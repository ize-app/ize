import { useQuery } from "@apollo/client";
import { createContext } from "react";

import { MeDocument, MePartsFragment } from "../graphql/generated/graphql";

interface CurrentUserContextValue {
  me: MePartsFragment | undefined | null;
  meLoading: boolean;
}

export const CurrentUserContext = createContext<CurrentUserContextValue>({
  me: null,
  meLoading: false,
});

export const CurrentUserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data, loading: meLoading } = useQuery(MeDocument);
  const me = data?.me;

  return (
    <CurrentUserContext.Provider value={{ me: me, meLoading }}>
      {children}
    </CurrentUserContext.Provider>
  );
};
