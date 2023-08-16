import { useQuery } from "@apollo/client";
import { MeDocument } from "../graphql/generated/graphql";

export const LoggedInUser: React.FC = () => {
  const { data } = useQuery(MeDocument);

  return <div>{data?.me?.discordData?.username}</div>
};
