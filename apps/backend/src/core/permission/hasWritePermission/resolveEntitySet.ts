import { Prisma } from "@prisma/client";

import { prisma } from "../../../prisma/client";
import {
  GroupCustomPrismaType,
  GroupDiscordPrismaType,
  GroupNftPrismaType,
  GroupPrismaType,
  groupInclude,
} from "@/core/entity/group/formatGroup";
import { identityInclude, IdentityPrismaType } from "@/core/entity/identity/types";
import { PermissionPrismaType } from "../types";

// creates unique list of different group / identity types for a given permission set
// resolves custom groups to their consitituent group / identity members
export const resolveEntitySet = async ({
  permission,
  transaction = prisma,
}: {
  permission: PermissionPrismaType;
  transaction?: Prisma.TransactionClient;
}) => {
  if (!permission.EntitySet)
    return {
      nftGroups: [],
      discordRoleGroups: [],
      identities: [],
    };

  const groups: GroupPrismaType[] = permission.EntitySet.EntitySetEntities.filter(
    (entity) => !!entity.Entity.Group?.id,
  ).map((entity) => entity.Entity.Group as GroupPrismaType);

  const customGroups = new Set<GroupCustomPrismaType>();
  const discordRoleGroups = new Set<GroupDiscordPrismaType>();
  const nftGroups = new Set<GroupNftPrismaType>();
  const identities = new Set<IdentityPrismaType>();

  const sortGroup = (group: GroupPrismaType) => {
    if (!!group.GroupCustom) customGroups.add(group.GroupCustom);
    else if (!!group.GroupDiscordRole) discordRoleGroups.add(group.GroupDiscordRole);
    else if (!!group.GroupNft) nftGroups.add(group.GroupNft);
  };

  groups.forEach((group) => sortGroup(group));

  const customGroupIds = Array.from(customGroups).map((cg) => cg.id);

  const resolvedGroups = await transaction.customGroupMemberGroup.findMany({
    where: {
      groupCustomId: { in: customGroupIds },
    },
    include: {
      Group: {
        include: groupInclude,
      },
    },
  });

  const resolvedIdentities = await transaction.customGroupMemberIdentity.findMany({
    where: {
      groupCustomId: { in: customGroupIds },
    },
    include: {
      Identity: {
        include: identityInclude,
      },
    },
  });

  resolvedGroups.forEach((memberGroup) => sortGroup(memberGroup.Group));
  resolvedIdentities.forEach((memberIdentity) => identities.add(memberIdentity.Identity));

  return {
    nftGroups: Array.from(nftGroups),
    discordRoleGroups: Array.from(discordRoleGroups),
    identities: Array.from(identities),
  };
};
