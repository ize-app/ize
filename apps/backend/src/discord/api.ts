import { Prisma, User } from "@prisma/client";
import { Guild } from "discord.js";
import bcrypt from "bcrypt";

export class DiscordApi {
  private readonly token: string;

  constructor(
    user: Prisma.UserGetPayload<{
      include: { discordOauth: true; discordData: true };
    }>
  ) {
    this.token = user.discordOauth.accessToken;
  }

  async getDiscordServers(): Promise<Array<Guild>> {
    console.log("this.token", this.token);

    const guildsResponse = await fetch(
      "https://discord.com/api/users/@me/guilds",
      {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      }
    );

    return guildsResponse.json();
  }
}
