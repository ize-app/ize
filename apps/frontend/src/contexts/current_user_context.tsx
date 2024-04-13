import { ApolloQueryResult, useQuery } from "@apollo/client";
import { Dispatch, SetStateAction, createContext, useEffect, useState } from "react";

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
  authModalOpen: boolean;
  setAuthModalOpen: Dispatch<SetStateAction<boolean>>;
  // groups: {
  //   data: GroupsQuery | undefined;
  //   loading: boolean;
  // };
}

export const CurrentUserContext = createContext<CurrentUserContextValue>({
  me: null,
  meLoading: false,
  refetch: null,
  authModalOpen: false,
  setAuthModalOpen: () => {
    return;
  },
  // groups: {
  //   data: undefined,
  //   loading: false,
  // },
});

export const CurrentUserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const { user } = useStytchUser();
  const { data: medata, loading: meLoading, refetch } = useQuery(MeDocument);
  const me = medata?.me;

  // const { data: groupsData, loading: groupsLoading } = useQuery(GroupsDocument, {
  //   skip: !me,
  // });

  useEffect(() => {
    refetch();
  }, [user, refetch]);

  return (
    <CurrentUserContext.Provider
      value={{ me, meLoading, refetch, authModalOpen, setAuthModalOpen }}
    >
      {children}
    </CurrentUserContext.Provider>
  );
};
