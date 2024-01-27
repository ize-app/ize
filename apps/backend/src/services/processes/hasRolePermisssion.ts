// import { RoleType } from "@prisma/client";
import { Blockchain, RoleType } from "@/graphql/generated/resolver-types";
import { roleSetInclude, RoleSetPrismaType } from "@/utils/formatProcess";
import { GraphqlRequestContext } from "@graphql/context";
import { Prisma } from "@prisma/client";
import { HATS_V1 } from "@hatsprotocol/sdk-v1-core";

import { prisma } from "../../prisma/client";
import { DiscordApi } from "@/discord/api";
import { alchemyClient } from "@/blockchain/clients/alchemyClient";
import { GroupNftPrismaType } from "@/utils/formatGroup";
import { hatsClient } from "@/blockchain/clients/hatsClient";

const processVersionRolesInclude = Prisma.validator<Prisma.ProcessVersionInclude>()({
  roleSet: {
    include: roleSetInclude,
  },
});

// checks whether one of a user's identities/groups has permissions
// to make a request or response
const hasRolePermission = async ({
  roleType,
  context,
  processVersionId,
  transaction = prisma,
}: {
  roleType: RoleType;
  context: GraphqlRequestContext;
  processVersionId: string;
  transaction?: Prisma.TransactionClient;
}): Promise<boolean> => {
  if (!context.currentUser) throw Error("ERROR Unauthenticated user");

  const processVersion = await transaction.processVersion.findFirstOrThrow({
    include: processVersionRolesInclude,
    where: {
      id: processVersionId,
    },
  });

  if (await hasIdentityPermission({ roleType, context, roleSet: processVersion.roleSet }))
    return true;

  if (await hasDiscordRoleGroupPermission({ roleType, context, roleSet: processVersion.roleSet }))
    return true;

  if (await hasNftRoleGroupPermission({ roleType, context, roleSet: processVersion.roleSet }))
    return true;

  return false;
};

export default hasRolePermission;

// checks whether one of a user's identities are assigned a role
// for a given set of request or respond roles.
const hasIdentityPermission = async ({
  roleType,
  roleSet,
  context,
}: {
  roleType: RoleType;
  roleSet: RoleSetPrismaType;
  context: GraphqlRequestContext;
}): Promise<boolean> => {
  if (!context.currentUser) throw Error("ERROR Unauthenticated user");

  const identityIds = context.currentUser.Identities.map((identity) => identity.id);

  const hasIdentityPermission = roleSet.RoleIdentities.some(
    (id) => identityIds.includes(id.identityId) && id.type === roleType,
  );

  return hasIdentityPermission;
};

// checks whether user has permission according to their discord @roles
// for a given set of request or respond roles.
// optimized for minimizing the number of discord API queries
const hasDiscordRoleGroupPermission = async ({
  roleType,
  roleSet,
  context,
}: {
  roleType: RoleType;
  roleSet: RoleSetPrismaType;
  context: GraphqlRequestContext;
}): Promise<boolean> => {
  if (!context.currentUser) throw Error("ERROR Unauthenticated user");
  if (!context.discordApi) throw Error("No Discord authentication data for user");

  const botApi = DiscordApi.forBotUser();

  // pull out role groups for discord
  const discordRoleGroups = roleSet.RoleGroups.filter(
    (roleGroup) => !!roleGroup.Group.GroupDiscordRole && roleGroup.type === roleType,
  ).map((roleGroup) => roleGroup.Group.GroupDiscordRole);

  if (discordRoleGroups.length === 0) return false;

  // for now, there is only one discord account per user
  const userDiscordIdentity = context.currentUser.Identities.find((id) => !!id.IdentityDiscord);
  if (!userDiscordIdentity?.IdentityDiscord?.discordUserId)
    throw Error("No authenticated Discord user");

  const serverIdsForEveryoneRole = discordRoleGroups
    .filter((roleGroup) => roleGroup?.name === "@everyone")
    .map((roleGroup) => roleGroup?.discordServer.discordServerId);

  const serverIdsForOtherRoles = [
    ...new Set(
      discordRoleGroups
        .filter((roleGroup) => roleGroup?.name === "@everyone")
        .map((roleGroup) => roleGroup?.discordServer.discordServerId),
    ),
  ];

  const userServers = await context.discordApi.getDiscordServers();

  // check whether user is part of a server that has its @everyone role on the process
  const matchesEveryoneRole = serverIdsForEveryoneRole.map((serverId) =>
    userServers.some((userServer) => userServer.id === serverId),
  );
  if (matchesEveryoneRole) return true;

  // for remaining roles, we can assume they have discord bot (@everyone is the only role that doesn't require bot)
  // get users member object for each guilds. this object contains guild roles
  const userServerMembers = await Promise.all(
    serverIdsForOtherRoles.map(async (server) => {
      return botApi.getDiscordGuildMember({
        serverId: server as string,
        memberId: userDiscordIdentity?.IdentityDiscord?.discordUserId as string,
      });
    }),
  );

  //   converting to Set to remove many duplicate "undefined" roleIds
  const roleIds = [...new Set(userServerMembers.map((member) => member.roles).flat())].filter(
    (val) => !!val,
  );

  // check if roleId is in list of Discord roles
  const hasDiscordRoleGroupPermission = discordRoleGroups.some((roleGroup) =>
    roleIds.some((roleId) => roleGroup?.discordRoleId === roleId),
  );

  return hasDiscordRoleGroupPermission;
};

// checks whether user has permission according to their discord @roles
// for a given set of request or respond roles.
// optimized for minimizing the number of discord API queries
const hasNftRoleGroupPermission = async ({
  roleType,
  roleSet,
  context,
}: {
  roleType: RoleType;
  roleSet: RoleSetPrismaType;
  context: GraphqlRequestContext;
}): Promise<boolean> => {
  if (!context.currentUser) throw Error("ERROR Unauthenticated user");
  if (!context.discordApi) throw Error("No Discord authentication data for user");

  let foundRole = false;

  const userAddress = context.currentUser.Identities.find((id) => !!id.IdentityBlockchain)
    ?.IdentityBlockchain?.address;

  if (!userAddress) return false;

  const nftRoleGroups = roleSet.RoleGroups.filter(
    (roleGroup) => !!roleGroup.Group.GroupNft && roleGroup.type === roleType,
  ).map((roleGroup) => roleGroup.Group.GroupNft);

  if (nftRoleGroups.length === 0) return false;

  const tokensByChain = new Map<Blockchain, GroupNftPrismaType[]>();

  // seperate out NFTs into each chain
  nftRoleGroups.forEach((role) => {
    if (!role) return;
    if (tokensByChain.has(role.NftCollection.chain as Blockchain)) {
      (tokensByChain.get(role.NftCollection.chain as Blockchain) as GroupNftPrismaType[]).push(
        role,
      );
    } else {
      // Key doesn't exist, so create a new entry with an array containing the value
      tokensByChain.set(role?.NftCollection.chain as Blockchain, [role]);
    }
    role?.NftCollection.chain;
  });

  // get owners NFts by chain
  for (let [chain, nfts] of tokensByChain.entries()) {
    if (foundRole === true) break;
    // create unique list of collections that are assigned roles
    let contractAddresses = new Set<string>();
    nfts.forEach((nft) => contractAddresses.add(nft.NftCollection.address));
    // get all of a user's nfts
    const { ownedNfts } = await alchemyClient.forChain(chain).nft.getNftsForOwner(userAddress, {
      omitMetadata: true,
      contractAddresses: Array.from(contractAddresses),
    });

    for (let i = 0; i <= nfts.length - 1; i++) {
      const nft = nfts[i];
      // check whether user has permission depending on the type of the nft
      // allTokens means that any token in collection has access to this role
      if (!nft.tokenId) {
        if (ownedNfts.some((ownedNft) => ownedNft.contractAddress === nft.NftCollection.address))
          return true; // TODO: this is probebly not quite right
      }
      // hats tokens have special logic to determine 1) if the hat is active
      // and 2) whether the role applies to tokens further down in the hats tree
      else if (nft.NftCollection.address === HATS_V1) {
        if (nft.hatsBranch) {
          const isAdmin = await hatsClient.forChain(chain).isAdminOfHat({
            user: userAddress as `0x${string}`,
            hatId: BigInt(nft.tokenId),
          });
          if (isAdmin) foundRole = true;
        } else {
          const isWearer = await hatsClient.forChain(chain).isWearerOfHat({
            wearer: userAddress as `0x${string}`,
            hatId: BigInt(nft.tokenId),
          });
          if (isWearer) foundRole = true;
        }
      }
      // for all other nfts, it's just whether or not you have that particular token
      else {
        if (
          ownedNfts.some(
            (ownedNft) =>
              ownedNft.contractAddress === nft.NftCollection.address &&
              ownedNft.tokenId === nft.tokenId,
          )
        )
          foundRole = true;
      }
      if (foundRole === true) break;
    }
  }

  return foundRole;
};
