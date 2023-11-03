import { DiscordApi } from "@discord/api";
import { Prisma } from "@prisma/client";

import { userInclude, formatUser } from "./formatUser";
import { Group } from "frontend/src/graphql/generated/graphql";

export const groupInclude = Prisma.validator<Prisma.GroupInclude>()({
  creator: {
    include: userInclude,
  },
  discordRoleGroup: {
    include: {
      discordServer: true,
    },
  },
});

type GroupPrismaType = Prisma.GroupGetPayload<{
  include: typeof groupInclude;
}>;

export const formatGroup = (group: GroupPrismaType): Group => ({
  ...group,
  __typename: "Group",
  creator: formatUser(group.creator),
  // discord only includes the @sign for @everyone
  name:
    group.discordRoleGroup.name !== "@everyone"
      ? "@" + group.discordRoleGroup.name
      : group.discordRoleGroup.name,
  icon: group.discordRoleGroup.icon
    ? DiscordApi.createRoleIconURL(
        group.discordRoleGroup.discordRoleId,
        group.discordRoleGroup.icon,
      )
    : group.discordRoleGroup.name === "@everyone"
    ? DiscordApi.createServerIconURL(
        group.discordRoleGroup.discordServer.discordServerId,
        group.discordRoleGroup.discordServer.icon,
      )
    : null,
  // Discord uses 0 to mean "no color", though we want to represent that with null instead
  color:
    group.discordRoleGroup.color === 0
      ? null
      : DiscordApi.colorIntToHex(group.discordRoleGroup.color),
  memberCount: group.discordRoleGroup.memberCount,
  organization: {
    name: group.discordRoleGroup.discordServer.name,
    icon: DiscordApi.createServerIconURL(
      group.discordRoleGroup.discordServer.discordServerId,
      group.discordRoleGroup.discordServer.icon,
    ),
  },
  createdAt: group.createdAt.toString(),
});
