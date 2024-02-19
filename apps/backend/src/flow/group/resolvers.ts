import { GroupPrismaType } from "./types";
import { Group, GroupType } from "@/graphql/generated/resolver-types";
import { DiscordApi } from "@/discord/api";
import { resolveUser } from "../user/resolvers";
import { GraphQLError, ApolloServerErrorCode } from "@graphql/errors";

export const resolveGroup = (group: GroupPrismaType): Group => {
  if (group.GroupDiscordRole) {
    return resolveDiscordGroup(group);
  } else if (group.GroupNft) {
    return resolveGroupNft(group);
  } else if (group.GroupCustom) {
    return resolveGroupCustom(group);
  } else {
    throw new GraphQLError("Invalid group type.", {
      extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
    });
  }
};

const resolveDiscordGroup = (group: GroupPrismaType): Group => {
  if (!group.GroupDiscordRole)
    throw new GraphQLError("Missing Discord role group details", {
      extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
    });
  const discordGroup: Group = {
    ...group,
    __typename: "Group",
    creator: resolveUser(group.creator),
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

const resolveGroupNft = (group: GroupPrismaType): Group => {
  if (!group.GroupNft)
    throw new GraphQLError("Missing NFT group details", {
      extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
    });
  const { GroupNft: nft } = group;
  const discordGroup: Group = {
    ...group,
    __typename: "Group",
    creator: resolveUser(group.creator),
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

const resolveGroupCustom = (group: GroupPrismaType): Group => {
  if (!group.GroupCustom)
    throw new GraphQLError("Missing custom group details", {
      extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
    });
  const { GroupCustom: custom } = group;
  return {
    ...group,
    creator: resolveUser(group.creator),
    name: custom.name,
    createdAt: group.createdAt.toString(),
    groupType: { __typename: "GroupCustom", ...custom } as GroupType,
  };
};
