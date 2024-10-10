import { Prisma } from "@prisma/client";

import { GraphqlRequestContext } from "@/graphql/context";
import { ApolloServerErrorCode, CustomErrorCodes, GraphQLError } from "@graphql/errors";

import { IdentityPrismaType } from "../entity/identity/identityPrismaTypes";
import {
  hasWriteIdentityPermission,
  hasWriteUserPermission,
} from "../permission/hasWritePermission";
import { PermissionPrismaType } from "../permission/permissionPrismaTypes";
import { getUserEntityIds } from "../user/getUserEntityIds";
import { UserPrismaType, userInclude } from "../user/userPrismaTypes";

interface IdentityContext {
  type: "user";
  context: GraphqlRequestContext;
}

interface UserContext {
  type: "identity";
  identity: IdentityPrismaType;
}

export type UserOrIdentityContextInterface = IdentityContext | UserContext;


// an action can sometimes be initited by a user (when logged in into the app) or an identity (if the user is interacting via Ize through another platform)
export const getUserOrIdentityContext = async ({
  entityContext,
  permission,
  transaction,
}: {
  entityContext: UserOrIdentityContextInterface;
  permission: PermissionPrismaType | null;
  transaction: Prisma.TransactionClient;
}) => {
  // entityId that will be associated with this response
  let entityId: string;
  let user: UserPrismaType | undefined;
  // all entityIds that are associated together as belonging to a single user
  let entityIds: string[];
  let hasPermission = false;
  if (entityContext.type === "user") {
    const { context } = entityContext;
    // Use args and context here

    if (!context?.currentUser)
      throw new GraphQLError("Unauthenticated", {
        extensions: { code: CustomErrorCodes.Unauthenticated },
      });

    user = context.currentUser;
    entityId = context.currentUser.entityId;
    entityIds = getUserEntityIds(context.currentUser);

    hasPermission = await hasWriteUserPermission({
      permission: permission,
      context,
      transaction,
    });
  } else if (entityContext.type === "identity") {
    const { identity } = entityContext;

    if (identity.userId) {
      user = await transaction.user.findUniqueOrThrow({
        where: { id: identity.userId },
        include: userInclude,
      });
    }

    entityId = identity.entityId;
    entityIds = [entityId];

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

  return { entityId, user, entityIds, hasPermission };
};
