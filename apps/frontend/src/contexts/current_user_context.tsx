import { useQuery } from "@apollo/client";
import { MeDocument, UserPartsFragment, UserPartsFragmentDoc } from "../graphql/generated/graphql";
import React from "react";
import { FragmentType, useFragment } from "../graphql/generated";

interface CurrentUserContextValue {
  user: UserPartsFragment | undefined | null;
}

export const CurrentUserContext = React.createContext<CurrentUserContextValue>({
  user: undefined,
});

export const CurrentUserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data } = useQuery(MeDocument);
  const userData = data?.me as FragmentType<typeof UserPartsFragmentDoc>;
  const user = useFragment(UserPartsFragmentDoc, userData);

  return (
    <CurrentUserContext.Provider value={{ user }}>
      {children}
    </CurrentUserContext.Provider>
  );
}
