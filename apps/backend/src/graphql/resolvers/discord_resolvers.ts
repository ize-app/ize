import { IDiscordServer } from "@discord/server_types";
import { GraphqlRequestContext } from "../context";
import { Guild } from "discord.js";
import { DiscordApi } from "@discord/api";

const discordServers = async (
  root: unknown,
  args: {},
  context: GraphqlRequestContext
): Promise<Array<IDiscordServer>> => {
  const botApi = DiscordApi.forBotUser();
  const botGuilds = await botApi.getDiscordServers();
  const userGuilds = await context.discordApi.getDiscordServers();

  const guilds = userGuilds.filter((guild: Guild) => {
    return botGuilds.some((botGuild: Guild) => botGuild.id === guild.id);
  });

  const servers = guilds.map((guild: Guild) => ({
    id: guild.id,
    name: guild.name,
  }));

  return servers;
};

export const discordQueries = {
  discordServers,
};
