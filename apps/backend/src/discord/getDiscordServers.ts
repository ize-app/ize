import { APIGuild } from "discord.js";

import { DiscordApi } from "@/discord/api";
import { GraphqlRequestContext } from "@/graphql/context";
import { DiscordServer } from "@/graphql/generated/resolver-types";

export const getDiscordServers = async ({
  context,
}: {
  context: GraphqlRequestContext;
}): Promise<Array<DiscordServer>> => {
  if (!context.discordApi) return [];

  const botApi = DiscordApi.forBotUser();
  const botGuilds = await botApi.getDiscordServers();

  const userGuilds = await context.discordApi.getDiscordServers();

  const servers: DiscordServer[] = userGuilds.map((guild: APIGuild) => ({
    id: guild.id,
    name: guild.name,
    icon: guild.icon ? DiscordApi.createServerIconURL(guild.id, guild.icon) : null,
    hasCultsBot: botGuilds.some((botGuild: APIGuild) => botGuild.id === guild.id),
  }));

  return servers;
};
