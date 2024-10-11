import { Prisma } from "@prisma/client";

import { prisma } from "@/prisma/client";
import { ApolloServerErrorCode, CustomErrorCodes, GraphQLError } from "@graphql/errors";

import { hasWriteIdentityPermission, hasWriteUserPermission } from "./hasWritePermission";
import { PermissionPrismaType } from "./permissionPrismaTypes";
import { UserOrIdentityContextInterface } from "../entity/UserOrIdentityContext";

// an action can sometimes be initited by a user (when logged into the app) or an identity (if the user is interacting via Ize through another platform)
// purpose of this function is to check permissions for both users and identities
export const getEntityPermissions = async ({
  entityContext,
  permission,
  transaction = prisma,
}: {
  entityContext: UserOrIdentityContextInterface;
  permission: PermissionPrismaType | null;
  transaction?: Prisma.TransactionClient;
}) => {
  let hasPermission = false;
  if (entityContext.type === "user") {
    const { context } = entityContext;

    if (!context?.currentUser)
      throw new GraphQLError("Unauthenticated", {
        extensions: { code: CustomErrorCodes.Unauthenticated },
      });

    hasPermission = await hasWriteUserPermission({
      permission: permission,
      context,
      transaction,
    });
  }
  // security model is that identity permission only gives access to that identity, not other identities linked via a user
  else if (entityContext.type === "identity") {
    const { identity } = entityContext;

    hasPermission = await hasWriteIdentityPermission({
      permission: permission,
      identity,
      transaction,
    });
  } else {
    throw new GraphQLError("Invalid entity context", {
      extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
    });
  }

  return hasPermission;
};
