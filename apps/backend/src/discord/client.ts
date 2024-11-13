import { Client, Events, GatewayIntentBits } from "discord.js";

import config from "@/config";

const discordBotClient = new Client({ intents: [GatewayIntentBits.Guilds] });

discordBotClient.once(Events.ClientReady, (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
});

discordBotClient.login(config.DISCORD_IZE_BOT_API_TOKEN);

export { discordBotClient };
