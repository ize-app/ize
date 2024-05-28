const botInviteUrl = new URL("https://discord.com/api/oauth2/authorize?");

botInviteUrl.searchParams.append("client_id", import.meta.env.VITE_DISCORD_BOT_CLIENT_ID);
botInviteUrl.searchParams.append("permissions", "0");
botInviteUrl.searchParams.append("scope", "bot");

export default botInviteUrl;
