import { DiscordApi } from "@/discord/api";
import { GraphqlRequestContext } from "@/graphql/context";
import { DiscordServer } from "@/graphql/generated/resolver-types";
import { APIGuild } from "discord.js";

export const getDiscordServers = async ({
  context,
}: {
  context: GraphqlRequestContext;
}): Promise<Array<DiscordServer>> => {
  if (!context.discordApi) return [];

  try {
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
  } catch (error) {
    // Fail gracefully when Discord API hits rate limtis
    // TODO: implement retry logic
    return [];
  }
};
