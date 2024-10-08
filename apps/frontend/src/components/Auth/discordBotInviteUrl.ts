const discordBotInviteUrl = new URL("https://discord.com/api/oauth2/authorize?");

discordBotInviteUrl.searchParams.append(
  "client_id",
  import.meta.env.VITE_DISCORD_BOT_CLIENT_ID as string,
);
discordBotInviteUrl.searchParams.append("permissions", "0");
discordBotInviteUrl.searchParams.append("scope", "bot");

export default discordBotInviteUrl;
