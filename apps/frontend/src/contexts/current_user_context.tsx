import { useQuery } from "@apollo/client";
import { createContext } from "react";

import { MeDocument, MePartsFragment } from "../graphql/generated/graphql";

interface CurrentUserContextValue {
  user: MePartsFragment | undefined | null;
  userLoading: boolean;
}

export const CurrentUserContext = createContext<CurrentUserContextValue>({
  user: null,
  userLoading: false,
});

export const CurrentUserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data, loading: userLoading } = useQuery(MeDocument);
  const user = data?.me;

  return (
    <CurrentUserContext.Provider value={{ user, userLoading }}>
      {children}
    </CurrentUserContext.Provider>
  );
};
