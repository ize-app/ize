import { IDiscordServer } from "@discord/server_types";
import { GraphqlRequestContext } from "../context";
import { Guild } from "discord.js";

const discordServers = async (
  root: unknown,
  args: {},
  context: GraphqlRequestContext
): Promise<Array<IDiscordServer>> => {
  const guilds = await context.discordApi.getDiscordServers();

  console.log("guilds", guilds);
  const servers = guilds.map((guild: Guild) => ({
    id: guild.id,
    name: guild.name,
  }));
  return servers;
};

export const discordQueries = {
  discordServers,
};
