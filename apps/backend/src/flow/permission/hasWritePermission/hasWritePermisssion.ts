import { GraphqlRequestContext } from "@graphql/context";
import { Prisma } from "@prisma/client";

import { prisma } from "../../../prisma/client";
import { hasIdentityPermission } from "./hasIdentityPermission";
import { hasDiscordRoleGroupPermission } from "./hasDiscordRoleGroupPermission";
import { hasNftGroupPermission } from "./hasNftGroupPermission";
import { PermissionPrismaType } from "../types";
import { CustomErrorCodes, GraphQLError } from "@graphql/errors";
import { resolveEntitySet } from "./resolveEntitySet";

// checks whether one of a user's identities/groups has permissions to make a request or response
// this function checks sources of truth for membership, so it's slow but secure and only intended for write operations
export const hasWritePermission = async ({
  permission,
  context,
  transaction = prisma,
}: {
  permission: PermissionPrismaType;
  context: GraphqlRequestContext;
  transaction?: Prisma.TransactionClient;
}): Promise<boolean> => {
  if (!context.currentUser)
    throw new GraphQLError("Unauthenticated", {
      extensions: { code: CustomErrorCodes.Unauthenticated },
    });

  if (permission.anyone) return true;

  const { discordRoleGroups, nftGroups, identities } = await resolveEntitySet({
    permission,
    transaction,
  });

  if (await hasIdentityPermission({ identities, userIdentities: context.currentUser.Identities }))
    return true;

  if (await hasNftGroupPermission({ nftGroups, userIdentities: context.currentUser.Identities }))
    return true;

  if (await hasDiscordRoleGroupPermission({ discordRoleGroups, context })) return true;

  return false;
};
