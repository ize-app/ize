import { useQuery } from "@apollo/client";

import { UsersDocument } from "../graphql/generated/graphql";

export const Users: React.FC = () => {
  const { data } = useQuery(UsersDocument);

  return data?.users?.map((user) => <div>{user?.name}</div>);
};
