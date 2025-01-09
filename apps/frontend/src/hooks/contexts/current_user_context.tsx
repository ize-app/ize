import { ApolloQueryResult, useQuery } from "@apollo/client";
import * as Sentry from "@sentry/react";
import { useStytchUser } from "@stytch/react";
import { Dispatch, SetStateAction, createContext, useEffect, useState } from "react";
import { Exact } from "utility-types/dist/mapped-types";

import { IdentityState } from "@/components/Auth/IdentityModal";

import { MeDocument, MePartsFragment, MeQuery } from "../../graphql/generated/graphql";

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
  identityModalState: IdentityState | null;
  setIdentityModalState: Dispatch<SetStateAction<IdentityState | null>>;
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
  setAuthModalOpen: (): void => {
    return;
  },
  identityModalState: null,
  setIdentityModalState: (): void => {
    return;
  },
  // groups: {
  //   data: undefined,
  //   loading: false,
  // },
});

export const CurrentUserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [identityModalState, setIdentityModalState] = useState<IdentityState | null>(null);

  const { user } = useStytchUser();
  const { data: medata, loading: meLoading, refetch } = useQuery(MeDocument);
  const me = medata?.me;

  // console.log("me", me);

  // const { data: groupsData, loading: groupsLoading } = useQuery(GroupsDocument, {
  //   skip: !me,
  // });

  useEffect(() => {
    refetch();
  }, [user, refetch]);

  useEffect(() => {
    Sentry.setUser({
      id: me?.user.id,
      username: me?.user.name,
    });
  }, [me]);

  return (
    <CurrentUserContext.Provider
      value={{
        me,
        meLoading,
        refetch,
        authModalOpen,
        setAuthModalOpen,
        identityModalState,
        setIdentityModalState,
      }}
    >
      {children}
    </CurrentUserContext.Provider>
  );
};
