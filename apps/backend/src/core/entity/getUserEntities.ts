import { Prisma } from "@prisma/client";

import { prisma } from "@/prisma/client";
import { ApolloServerErrorCode, CustomErrorCodes, GraphQLError } from "@graphql/errors";

import { UserOrIdentityContextInterface } from "../entity/UserOrIdentityContext";
import { getUserEntityIds } from "../user/getUserEntityIds";
import { UserPrismaType, userInclude } from "../user/userPrismaTypes";

// since functions can be called by both users and identities, this function returns normalized data for both entity types
export const getUserEntities = async ({
  entityContext,
  transaction = prisma,
}: {
  entityContext: UserOrIdentityContextInterface;
  transaction?: Prisma.TransactionClient;
}) => {
  // entityId that will be associated with this response
  let entityId: string;
  let user: UserPrismaType | undefined;
  // all entityIds that are associated together as belonging to a single user
  let entityIds: string[];
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
  } else if (entityContext.type === "identity") {
    const { identity } = entityContext;

    entityId = identity.entityId;
    entityIds = [entityId];

    if (identity.userId) {
      user = await transaction.user.findUniqueOrThrow({
        where: { id: identity.userId },
        include: userInclude,
      });

      // entityId = user.entityId;
      entityIds = getUserEntityIds(user);
    }
  } else {
    throw new GraphQLError("Invalid entity context", {
      extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
    });
  }

  return { entityId, entityIds, user };
};
