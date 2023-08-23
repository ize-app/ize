import { useQuery } from "@apollo/client";
import { DiscordServersDocument } from "../graphql/generated/graphql";

export const DiscordUserServers = () => {
  const { data } = useQuery(DiscordServersDocument);

  const servers = data?.discordServers;

  return servers?.map((server) => (
    <div>{server.name}</div>
  ));
};
