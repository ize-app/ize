import { Prisma } from "@prisma/client";
import {
  Guild,
  Role,
  GuildMember,
  APIGuildMember,
  APIRole,
  APIGuild,
} from "discord.js";

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

  async getDiscordServers(): Promise<Array<APIGuild>> {
    const guildsResponse = await fetch(
      "https://discord.com/api/users/@me/guilds",
      {
        headers: this.headers,
      }
    );

    return guildsResponse.json();
  }

  async getDiscordServer(serverId: string): Promise<APIGuild> {
    const guildResponse = await fetch(
      `https://discord.com/api/guilds/${serverId}`,
      {
        headers: this.headers,
      }
    );

    return guildResponse.json();
  }

  async getDiscordServerRoles(serverId: string): Promise<APIRole[]> {
    if (!this.isBot) {
      throw new Error("Only bot users can get server roles");
    }

    const rolesResponse = await fetch(
      `https://discord.com/api/guilds/${serverId}/roles`,
      {
        headers: this.headers,
      }
    );

    return rolesResponse.json();
  }

  async getDiscordGuildMember({
    serverId,
    memberId,
  }: {
    serverId: string;
    memberId: string;
  }): Promise<APIGuildMember> {
    if (!this.isBot) {
      throw new Error("Only bot users can get member info");
    }

    const rolesResponse = await fetch(
      `https://discord.com/api/guilds/${serverId}/members/${memberId}`,
      {
        headers: this.headers,
      }
    );

    return rolesResponse.json();
  }

  async getDiscordGuildMembers({
    serverId,
  }: {
    serverId: string;
  }): Promise<APIGuildMember[]> {
    if (!this.isBot) {
      throw new Error("Only bot users can get member info");
    }

    // limit of 1000 members in response
    const rolesResponse = await fetch(
      `https://discord.com/api/guilds/${serverId}/members?limit=1000`,
      {
        headers: this.headers,
      }
    );

    return rolesResponse.json();
  }

  countRoleMembers(members: APIGuildMember[], roles: APIRole[]) :{[roleId:string]:number} {
    const nonbotMembers = members.filter((member)=> !member.user.bot)

    const everyoneRoleId = roles.find((role) => role.name === "@everyone").id

    const roleCounts = nonbotMembers.reduce((acc:{[roleId:string]:number} , curr) => {
      curr.roles.forEach((roleId)=> {
        if(acc.hasOwnProperty(roleId))  acc[roleId] = acc[roleId]++
        else acc[roleId] = 1
      })
    return acc 
    }, {})
    roleCounts[everyoneRoleId] = nonbotMembers.length

    return roleCounts
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
