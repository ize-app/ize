import { RoleType } from "@/graphql/generated/resolver-types";
import { roleSetInclude } from "@/utils/formatProcess";
import { GraphqlRequestContext } from "@graphql/context";
import { Prisma } from "@prisma/client";

import { prisma } from "../../../prisma/client";
import {
  GroupCustomPrismaType,
  GroupDiscordPrismaType,
  GroupNftPrismaType,
  GroupPrismaType,
  groupInclude,
} from "@/utils/formatGroup";
import { IdentityPrismaType, identityInclude } from "@/utils/formatIdentity";
import { hasIdentityPermission } from "./hasIdentityPermission";
import { hasDiscordRoleGroupPermission } from "./hasDiscordRoleGroupPermission";
import { hasNftGroupPermission } from "./hasNftGroupPermission";

const processVersionRolesInclude = Prisma.validator<Prisma.ProcessVersionInclude>()({
  roleSet: {
    include: roleSetInclude,
  },
});

// checks whether one of a user's identities/groups has permissions
// to make a request or response
// this function checks sources of truth for membership, so it's slow but secure and only intended for write operations
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

  const { discordRoleGroups, nftGroups, identities } = await resolveRoleSet({
    roleType,
    processVersionId,
    transaction,
  });

  if (await hasIdentityPermission({ identities, user: context.currentUser })) return true;

  if (await hasNftGroupPermission({ nftGroups, context })) return true;

  if (await hasDiscordRoleGroupPermission({ discordRoleGroups, context })) return true;

  return false;
};

export default hasRolePermission;

// creates unique list of different group / identity types for a given permission set
// resolves custom groups to their consitituent group / identity members
const resolveRoleSet = async ({
  roleType,
  processVersionId,
  transaction = prisma,
}: {
  roleType: RoleType;
  processVersionId: string;
  transaction?: Prisma.TransactionClient;
}) => {
  const processVersion = await transaction.processVersion.findFirstOrThrow({
    include: processVersionRolesInclude,
    where: {
      id: processVersionId,
      roleSet: {
        OR: [
          {
            RoleGroups: {
              some: {
                type: roleType,
              },
            },
          },
          {
            RoleIdentities: {
              some: {
                type: roleType,
              },
            },
          },
        ],
      },
    },
  });

  const customGroups = new Set<GroupCustomPrismaType>();
  const discordRoleGroups = new Set<GroupDiscordPrismaType>();
  const nftGroups = new Set<GroupNftPrismaType>();
  const identities = new Set<IdentityPrismaType>(
    processVersion.roleSet.RoleIdentities.map((ri) => ri.Identity),
  );

  const sortGroup = (group: GroupPrismaType) => {
    if (!!group.GroupCustom) customGroups.add(group.GroupCustom);
    else if (!!group.GroupDiscordRole) discordRoleGroups.add(group.GroupDiscordRole);
    else if (!!group.GroupNft) nftGroups.add(group.GroupNft);
  };

  processVersion.roleSet.RoleGroups.forEach((rg) => sortGroup(rg.Group));

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
