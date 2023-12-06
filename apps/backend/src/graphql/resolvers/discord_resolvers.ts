import { IDiscordServer } from "@discord/server_types";
import { GraphqlRequestContext } from "../context";
import { APIGuild } from "discord.js";
import { DiscordApi } from "@discord/api";
import { QueryDiscordServerRolesArgs } from "@graphql/generated/resolver-types";

export const discordServers = async (
  root: unknown,
  args: Record<string, never>,
  context: GraphqlRequestContext,
): Promise<Array<IDiscordServer>> => {
  const botApi = DiscordApi.forBotUser();
  const botGuilds = await botApi.getDiscordServers();
  if (!context.discordApi) throw Error("No Discord authentication data for user");
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

const discordServerRoles = async (root: unknown, args: QueryDiscordServerRolesArgs) => {
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
