import { Prisma, User } from "@prisma/client";
import { Guild } from "discord.js";

export class DiscordApi {
  constructor(
    private readonly token: string,
    private readonly isBot: boolean = false
  ) {}

  static forUser(
    user: Prisma.UserGetPayload<{
      include: { discordOauth: true; discordData: true };
    }>
  ) {
    return new DiscordApi(user.discordOauth.accessToken, false);
  }

  static forBotUser() {
    return new DiscordApi(process.env.DISCORD_CULTS_BOT_API_TOKEN, true);
  }

  async getDiscordServers(): Promise<Array<Guild>> {
    const guildsResponse = await fetch(
      "https://discord.com/api/users/@me/guilds",
      {
        headers: this.headers,
      }
    );

    return guildsResponse.json();
  }

  private get headers() {
    if (this.isBot) {
      return {
        Authorization: `Bot ${this.token}`,
      };
    } else {
      return {
        Authorization: `Bearer ${this.token}`,
      };
    }
  }
}
