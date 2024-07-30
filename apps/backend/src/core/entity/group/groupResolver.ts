import { DiscordApi } from "@/discord/api";
import { Group, GroupType } from "@/graphql/generated/resolver-types";
import { ApolloServerErrorCode, GraphQLError } from "@graphql/errors";

import { GroupPrismaType } from "./groupPrismaTypes";
import { userResolver } from "../../user/userResolver";

export const groupResolver = (
  group: GroupPrismaType,
  isWatched?: boolean,
  isMember?: boolean,
): Group => {
  if (group.GroupDiscordRole) {
    return resolveDiscordGroup(group, isWatched, isMember);
  } else if (group.GroupNft) {
    return resolveGroupNft(group, isWatched, isMember);
  } else if (group.GroupCustom) {
    return resolveGroupCustom(group, isWatched, isMember);
  } else {
    throw new GraphQLError("Invalid group type.", {
      extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
    });
  }
};

const resolveDiscordGroup = (
  group: GroupPrismaType,
  isWatched?: boolean,
  isMember?: boolean,
): Group => {
  if (!group.GroupDiscordRole)
    throw new GraphQLError("Missing Discord role group details", {
      extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
    });
  const discordGroup: Group = {
    __typename: "Group",
    id: group.id,
    entityId: group.entityId,
    creator: userResolver(group.creator),
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
    isMember: isMember ?? false,
    isWatched: isWatched ?? false,
  };
  return discordGroup;
};

const resolveGroupNft = (
  group: GroupPrismaType,
  isWatched?: boolean,
  isMember?: boolean,
): Group => {
  if (!group.GroupNft)
    throw new GraphQLError("Missing NFT group details", {
      extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
    });
  const { GroupNft: nft } = group;
  const discordGroup: Group = {
    __typename: "Group",
    id: group.id,
    entityId: group.entityId,
    creator: userResolver(group.creator),
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
    isMember: isMember ?? false,
    isWatched: isWatched ?? false,
  };
  return discordGroup;
};

const resolveGroupCustom = (
  group: GroupPrismaType,
  isWatched?: boolean,
  isMember?: boolean,
): Group => {
  if (!group.GroupCustom)
    throw new GraphQLError("Missing custom group details", {
      extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
    });
  const { GroupCustom: custom } = group;
  return {
    __typename: "Group",
    id: group.id,
    entityId: group.entityId,
    creator: userResolver(group.creator),
    name: custom.name,
    createdAt: group.createdAt.toString(),
    groupType: { __typename: "GroupCustom", ...custom } as GroupType,
    isMember: isMember ?? false,
    isWatched: isWatched ?? false,
  };
};
