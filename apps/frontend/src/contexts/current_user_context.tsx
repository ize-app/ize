import { useQuery } from "@apollo/client";
import { MeDocument, UserPartsFragment } from "../graphql/generated/graphql";
import React from "react";

interface CurrentUserContextValue {
  user: UserPartsFragment | undefined | null;
}

export const CurrentUserContext = React.createContext<CurrentUserContextValue>({
  user: undefined,
});

export const CurrentUserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data } = useQuery(MeDocument);
  const user = data?.me;

  return (
    <CurrentUserContext.Provider value={{ user }}>
      {children}
    </CurrentUserContext.Provider>
  );
}
