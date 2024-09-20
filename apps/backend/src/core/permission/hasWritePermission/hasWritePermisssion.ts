import { Prisma } from "@prisma/client";

import { GraphqlRequestContext } from "@graphql/context";
import { CustomErrorCodes, GraphQLError } from "@graphql/errors";

import { hasDiscordRoleGroupPermission } from "./hasDiscordRoleGroupPermission";
import { hasIdentityPermission } from "./hasIdentityPermission";
import { hasNftGroupPermission } from "./hasNftGroupPermission";
import { hasTelegramChatGroupPermission } from "./hasTelegramChatGroupPermission";
import { resolveEntitySet } from "./resolveEntitySet";
import { prisma } from "../../../prisma/client";
import { PermissionPrismaType } from "../permissionPrismaTypes";

// checks whether one of a user's identities/groups has permissions to make a request or response
// this function checks sources of truth for membership, so it's slow but secure and only intended for write operations
export const hasWritePermission = async ({
  permission,
  context,
  transaction = prisma,
}: {
  permission: PermissionPrismaType | null;
  context: GraphqlRequestContext;
  transaction?: Prisma.TransactionClient;
}): Promise<boolean> => {
  if (!permission) return false;

  if (!context.currentUser)
    throw new GraphQLError("Unauthenticated", {
      extensions: { code: CustomErrorCodes.Unauthenticated },
    });

  if (permission.anyone) return true;

  if (permission.userId === context.currentUser.id) return true;

  const { discordRoleGroups, nftGroups, telegramGroups, identities } = await resolveEntitySet({
    permission,
    transaction,
  });

  if (await hasIdentityPermission({ identities, userIdentities: context.currentUser.Identities }))
    return true;

  if (await hasTelegramChatGroupPermission({ telegramGroups, context })) return true;

  if (await hasNftGroupPermission({ nftGroups, userIdentities: context.currentUser.Identities }))
    return true;

  if (await hasDiscordRoleGroupPermission({ discordRoleGroups, context })) return true;

  return false;
};
