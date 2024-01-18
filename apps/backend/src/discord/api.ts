/* eslint-disable no-prototype-builtins */
import { decrypt } from "@/encrypt";
import { MePrismaType } from "@/utils/formatUser";
import { APIGuildMember, APIRole, APIGuild } from "discord.js";

type DiscordImageSize = 16 | 32 | 64 | 128 | 256 | 512 | 1024 | 2048 | 4096;

export class DiscordApi {
  constructor(
    private readonly token: string,
    private readonly isBot: boolean = false,
  ) {}

  static forUser(user: MePrismaType) {
    const discordAuth = user.Oauths.find((oauth) => oauth.type === "Discord");
    if (!discordAuth) return undefined;
    else return new DiscordApi(decrypt(discordAuth.accessToken), false);
  }

  static forBotUser() {
    return new DiscordApi(process.env.DISCORD_CULTS_BOT_API_TOKEN as string, true);
  }

  static colorIntToHex(colorInt: number): string {
    return `#${colorInt.toString(16)}`;
  }

  private static createDiscordImageUrl = (
    resourceId: string,
    hash: string,
    resourceType: "avatars" | "icons" | "role-icons",
    size?: DiscordImageSize,
  ): string =>
    `https://cdn.discordapp.com/${resourceType}/${resourceId}/${hash}.png${
      size ? `?size=${size}` : ""
    }`;

  static createAvatarURL = (userId: string, imageHash: string, size?: DiscordImageSize): string =>
    this.createDiscordImageUrl(userId, imageHash, "avatars", size);

  static createServerIconURL = (
    serverId: string,
    imageHash: string,
    size?: DiscordImageSize,
  ): string => this.createDiscordImageUrl(serverId, imageHash, "icons", size);

  static createRoleIconURL = (roleId: string, imageHash: string, size?: DiscordImageSize): string =>
    this.createDiscordImageUrl(roleId, imageHash, "role-icons", size);

  async getDiscordServers(): Promise<Array<APIGuild>> {
    const guildsResponse = await fetch("https://discord.com/api/users/@me/guilds", {
      headers: this.headers,
    });

    return guildsResponse.json();
  }

  async getDiscordServer(serverId: string): Promise<APIGuild> {
    const guildResponse = await fetch(`https://discord.com/api/guilds/${serverId}`, {
      headers: this.headers,
    });

    return guildResponse.json();
  }

  async getDiscordServerRoles(serverId: string): Promise<APIRole[]> {
    if (!this.isBot) {
      throw new Error("Only bot users can get server roles");
    }

    const rolesResponse = await fetch(`https://discord.com/api/guilds/${serverId}/roles`, {
      headers: this.headers,
    });

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
      },
    );

    return rolesResponse.json();
  }

  async getDiscordGuildMembers({ serverId }: { serverId: string }): Promise<APIGuildMember[]> {
    if (!this.isBot) {
      throw new Error("Only bot users can get member info");
    }

    // limit of 1000 members in response
    const rolesResponse = await fetch(
      `https://discord.com/api/guilds/${serverId}/members?limit=1000`,
      {
        headers: this.headers,
      },
    );

    return rolesResponse.json();
  }

  countRoleMembers(members: APIGuildMember[], roles: APIRole[]): { [roleId: string]: number } {
    const nonbotMembers = members.filter((member) => !member?.user?.bot);

    const everyoneRole = roles.find((role) => role.name === "@everyone");

    const roleCounts = nonbotMembers.reduce((acc: { [roleId: string]: number }, curr) => {
      curr.roles.forEach((roleId) => {
        if (acc.hasOwnProperty(roleId)) acc[roleId] = acc[roleId]++;
        else acc[roleId] = 1;
      });
      return acc;
    }, {});
    if (everyoneRole) roleCounts[everyoneRole.id] = nonbotMembers.length;

    return roleCounts;
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
