import { IDiscordServer } from "@discord/server_types";
import { GraphqlRequestContext } from "../context";
import { APIGuild, Guild } from "discord.js";
import { DiscordApi } from "@discord/api";

export const discordServers = async (
  root: unknown,
  args: {},
  context: GraphqlRequestContext,
): Promise<Array<IDiscordServer>> => {
  const botApi = DiscordApi.forBotUser();
  const botGuilds = await botApi.getDiscordServers();
  const userGuilds = await context.discordApi.getDiscordServers();

  const guilds = userGuilds.filter((guild: APIGuild) => {
    return botGuilds.some((botGuild: APIGuild) => botGuild.id === guild.id);
  });

  const servers = guilds.map((guild: APIGuild) => ({
    id: guild.id,
    name: guild.name,
  }));

  return servers;
};

const discordServerRoles = async (
  root: unknown,
  args: { serverId: string },
  context: GraphqlRequestContext,
) => {
  const botApi = DiscordApi.forBotUser();
  const roles = await botApi.getDiscordServerRoles(args.serverId);
  const cleanedRoles = roles.map((role) => ({
    ...role,
    unicodeEmoji: role.unicode_emoji,
    botRole: !!role.tags?.bot_id,
  }));
  return cleanedRoles;
};

export const discordQueries = {
  discordServers,
  discordServerRoles,
};
