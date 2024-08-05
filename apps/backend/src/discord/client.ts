import { Client, Events, GatewayIntentBits } from "discord.js";

const discordBotClient = new Client({ intents: [GatewayIntentBits.Guilds] });

discordBotClient.once(Events.ClientReady, (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
});

discordBotClient.login(process.env.DISCORD_IZE_BOT_API_TOKEN);

export { discordBotClient };
