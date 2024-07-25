import { Prisma } from "@prisma/client";

import { prisma } from "@/prisma/client";
import { ApolloServerErrorCode, GraphQLError } from "@graphql/errors";

import { entityInclude } from "../entityPrismaTypes";

// a custom group's membership list cannot include another custom group
// this is to prevent circular references, simplify permissions logic, and simplify the UX of understanding what a custom group is
export const checkEntitiesForCustomGroups = async ({
  entityIds,
  transaction = prisma,
}: {
  entityIds: string[];
  transaction?: Prisma.TransactionClient;
}): Promise<void> => {
  const entities = await transaction.entity.findMany({
    include: entityInclude,
    where: { id: { in: entityIds } },
  });

  entities.forEach((entity) => {
    if (entity.Group?.GroupCustom) {
      throw new GraphQLError(
        `Error creating custom group entity set. Entity list includes a custom group entity. EntityId: ${entity.id}`,
        {
          extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
        },
      );
    }
  });
};
