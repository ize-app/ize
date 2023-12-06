import { useQuery } from "@apollo/client";
import { createContext } from "react";

import { MeDocument, MePartsFragment } from "../graphql/generated/graphql";

interface CurrentUserContextValue {
  user: MePartsFragment | undefined | null;
}

export const CurrentUserContext = createContext<CurrentUserContextValue>({
  user: undefined,
});

export const CurrentUserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { data } = useQuery(MeDocument);
  const user = data?.me;

  return (
    <CurrentUserContext.Provider value={{ user }}>
      {children}
    </CurrentUserContext.Provider>
  );
};
