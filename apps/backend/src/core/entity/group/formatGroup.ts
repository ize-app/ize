import { DiscordApi } from "@discord/api";
import { Prisma } from "@prisma/client";

import { userInclude, formatUser } from "../../user/formatUser";
import { Group, GroupType } from "@graphql/generated/resolver-types";

export const groupNftInclude = Prisma.validator<Prisma.GroupNftInclude>()({
  NftCollection: true,
});

export type GroupNftPrismaType = Prisma.GroupNftGetPayload<{
  include: typeof groupNftInclude;
}>;

export const groupDiscordInclude = Prisma.validator<Prisma.GroupDiscordRoleInclude>()({
  discordServer: true,
});

export type GroupDiscordPrismaType = Prisma.GroupDiscordRoleGetPayload<{
  include: typeof groupDiscordInclude;
}>;

export const groupCustomInclude = Prisma.validator<Prisma.GroupCustomInclude>()({});

export type GroupCustomPrismaType = Prisma.GroupCustomGetPayload<{
  include: typeof groupCustomInclude;
}>;

export const groupInclude = Prisma.validator<Prisma.GroupInclude>()({
  creator: {
    include: userInclude,
  },
  GroupDiscordRole: {
    include: groupDiscordInclude,
  },
  GroupNft: {
    include: groupNftInclude,
  },
  GroupCustom: {
    include: groupCustomInclude,
  },
});

export type GroupPrismaType = Prisma.GroupGetPayload<{
  include: typeof groupInclude;
}>;

export const formatGroup = (group: GroupPrismaType): Group => {
  if (group.GroupDiscordRole) {
    return formatDiscordGroup(group);
  } else if (group.GroupNft) {
    return formatGroupNft(group);
  } else if (group.GroupCustom) {
    return formatGroupCustom(group);
  } else {
    throw Error("ERROR: Unrecognized group type");
  }
};

const formatDiscordGroup = (group: GroupPrismaType): Group => {
  if (!group.GroupDiscordRole) throw Error("ERROR formatGroup: No Discord role group");
  const discordGroup: Group = {
    ...group,
    __typename: "Group",
    creator: formatUser(group.creator),
    // discord only includes the @sign for @everyone
    name:
      group.GroupDiscordRole.name !== "@everyone"
        ? "@" + group.GroupDiscordRole.name
        : group.GroupDiscordRole.name,
    icon:
      group.GroupDiscordRole.icon && group.GroupDiscordRole.discordRoleId
        ? DiscordApi.createRoleIconURL(
            group.GroupDiscordRole.discordRoleId,
            group.GroupDiscordRole.icon,
          )
        : null,
    // Discord uses 0 to mean "no color", though we want to represent that with null instead
    color:
      group.GroupDiscordRole.color === 0 || !group.GroupDiscordRole.color
        ? null
        : DiscordApi.colorIntToHex(group.GroupDiscordRole.color),
    memberCount: group.GroupDiscordRole.memberCount,
    organization: {
      name: group.GroupDiscordRole.discordServer.name,
      icon: group.GroupDiscordRole.discordServer.icon
        ? DiscordApi.createServerIconURL(
            group.GroupDiscordRole.discordServer.discordServerId,
            group.GroupDiscordRole.discordServer.icon,
          )
        : null,
    },
    createdAt: group.createdAt.toString(),
    groupType: { __typename: "DiscordRoleGroup", ...group.GroupDiscordRole },
  };
  return discordGroup;
};

const formatGroupNft = (group: GroupPrismaType): Group => {
  if (!group.GroupNft) throw Error("ERROR formatGroup: No NFT Group");
  const { GroupNft: nft } = group;
  const discordGroup: Group = {
    ...group,
    __typename: "Group",
    creator: formatUser(group.creator),
    name: nft.name,
    icon: nft.icon,
    color: null,
    memberCount: null,
    organization: {
      name: nft.NftCollection.name ?? "Unknown collection",
      icon: nft.NftCollection.icon,
    },
    createdAt: group.createdAt.toString(),
    groupType: { __typename: "GroupNft", ...nft } as GroupType,
  };
  return discordGroup;
};

const formatGroupCustom = (group: GroupPrismaType): Group => {
  if (!group.GroupCustom) throw Error("ERROR formatGroup: No Custom Group");
  const { GroupCustom: custom } = group;
  return {
    ...group,
    creator: formatUser(group.creator),
    name: custom.name,
    createdAt: group.createdAt.toString(),
    groupType: { __typename: "GroupCustom", ...custom } as GroupType,
  };
};
