import { APIGuild } from "discord.js";

import { DiscordApi } from "@discord/api";
import {
  DiscordServer,
  QueryDiscordServerRolesArgs,
  QueryResolvers,
} from "@graphql/generated/resolver-types";

import { GraphqlRequestContext } from "../context";
import { getDiscordServers as getDiscordServersService } from "@/discord/getDiscordServers";

// Returns all of a users discord servers, regardless of whether they connected Ize bot
export const discordServers = async (
  root: unknown,
  args: Record<string, never>,
  context: GraphqlRequestContext,
): Promise<Array<DiscordServer>> => {
  const botApi = DiscordApi.forBotUser();
  const botGuilds = await botApi.getDiscordServers();
  if (!context.discordApi) throw Error("No Discord authentication data for user");
  const userGuilds = await context.discordApi.getDiscordServers();

  const servers = userGuilds.map((guild: APIGuild) => ({
    id: guild.id,
    name: guild.name,
    hasCultsBot: botGuilds.some((botGuild: APIGuild) => botGuild.id === guild.id),
  }));

  return servers;
};

export const getDiscordServers: QueryResolvers["getDiscordServers"] = async (
  root: unknown,
  args: Record<string, never>,
  context: GraphqlRequestContext,
): Promise<Array<DiscordServer>> => {
  try {
    return await getDiscordServersService({ context });
  } catch (e) {
    return [];
  }
};

const discordServerRoles = async (root: unknown, args: QueryDiscordServerRolesArgs) => {
  if (!args.serverId) return [];
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
  discordServerRoles,
  getDiscordServers,
};
