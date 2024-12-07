import { Prisma } from "@prisma/client";

import { IdentityPrismaType } from "@/core/entity/identity/identityPrismaTypes";

import { hasIdentityPermission } from "./hasIdentityPermission";
import { hasTelegramChatGroupPermission } from "./hasTelegramChatGroupPermission";
import { resolveEntitySet } from "./resolveEntitySet";
import { prisma } from "../../../prisma/client";
import { PermissionPrismaType } from "../permissionPrismaTypes";

// checks whether a given identity has permissions to make a request or response
// this function is intended for cases where a user is interacting via Ize through another platform (e.g. Telegram)
// and there may not be a user identity associated with an identity
export const hasWriteIdentityPermission = async ({
  permission,
  identity,
  transaction = prisma,
}: {
  permission: PermissionPrismaType | null | undefined;
  identity: IdentityPrismaType;
  transaction?: Prisma.TransactionClient;
}): Promise<boolean> => {
  try {
    if (!permission) return false;

    if (permission.anyone) return true;

    const { telegramGroups, identities } = await resolveEntitySet({
      permission,
      transaction,
    });

    if (hasIdentityPermission({ identities, userIdentities: [identity] })) return true;

    if (await hasTelegramChatGroupPermission({ telegramGroups, identities: [identity] }))
      return true;

    return false;
  } catch (error) {
    console.error("Error in hasWriteIdentityPermission: ", error);
    return false;
  }
};
