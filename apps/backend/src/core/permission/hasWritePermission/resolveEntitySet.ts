import { Prisma } from "@prisma/client";

import {
  GroupCustomPrismaType,
  GroupDiscordPrismaType,
  GroupNftPrismaType,
  GroupPrismaType,
  GroupTelegramChatPrismaType,
  groupInclude,
} from "@/core/entity/group/groupPrismaTypes";
import { IdentityPrismaType, identityInclude } from "@/core/entity/identity/identityPrismaTypes";

import { prisma } from "../../../prisma/client";
import { PermissionPrismaType } from "../permissionPrismaTypes";

export interface ResolvedEntities {
  nftGroups: GroupNftPrismaType[];
  discordRoleGroups: GroupDiscordPrismaType[];
  telegramGroups: GroupTelegramChatPrismaType[];
  identities: IdentityPrismaType[];
}

// creates unique list of different group / identity types for a given permission set
// resolves custom groups to their consitituent group / identity members
// Note: custom groups cannot have another custom groups as members
export const resolveEntitySet = async ({
  permission,
  transaction = prisma,
}: {
  permission: PermissionPrismaType;
  transaction?: Prisma.TransactionClient;
}): Promise<ResolvedEntities> => {
  if (!permission.EntitySet)
    return {
      nftGroups: [],
      discordRoleGroups: [],
      telegramGroups: [],
      identities: [],
    };

  const customGroups = new Set<GroupCustomPrismaType>();
  const discordRoleGroups = new Set<GroupDiscordPrismaType>();
  const nftGroups = new Set<GroupNftPrismaType>();
  const telegramGroups = new Set<GroupTelegramChatPrismaType>();
  const identities = new Set<IdentityPrismaType>();

  const sortGroup = (group: GroupPrismaType) => {
    if (group.GroupCustom) customGroups.add(group.GroupCustom);
    else if (group.GroupDiscordRole) discordRoleGroups.add(group.GroupDiscordRole);
    else if (group.GroupNft) nftGroups.add(group.GroupNft);
    else if (group.GroupTelegramChat) telegramGroups.add(group.GroupTelegramChat);
  };

  permission.EntitySet.EntitySetEntities.forEach((entity) => {
    if (entity.Entity.Group) sortGroup(entity.Entity.Group);
    else if (entity.Entity.Identity) identities.add(entity.Entity.Identity);
  });

  const customGroupIds = Array.from(customGroups).map((cg) => cg.id);

  const resolvedGroups = await transaction.group.findMany({
    include: groupInclude,
    where: {
      Entity: {
        EntitySetEntities: {
          some: {
            EntitySet: {
              GroupCustom: {
                some: {
                  id: { in: customGroupIds },
                },
              },
            },
          },
        },
      },
    },
  });

  const resolvedIdentities = await transaction.identity.findMany({
    include: identityInclude,
    where: {
      Entity: {
        EntitySetEntities: {
          some: {
            EntitySet: {
              GroupCustom: {
                some: {
                  id: { in: customGroupIds },
                },
              },
            },
          },
        },
      },
    },
  });

  resolvedGroups.forEach((memberGroup) => sortGroup(memberGroup));
  resolvedIdentities.forEach((memberIdentity) => identities.add(memberIdentity));

  return {
    nftGroups: Array.from(nftGroups),
    discordRoleGroups: Array.from(discordRoleGroups),
    telegramGroups: Array.from(telegramGroups),
    identities: Array.from(identities),
  };
};
