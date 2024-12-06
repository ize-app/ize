import { Prisma } from "@prisma/client";

import { GraphqlRequestContext } from "@/graphql/context";
import { prisma } from "@/prisma/client";

// get groups that a user is a member of
export const getGroupIdsOfUser = async ({
  context,
  transaction = prisma,
}: {
  context: GraphqlRequestContext;
  transaction?: Prisma.TransactionClient;
}): Promise<string[]> => {
  const resp = await transaction.entityGroup.findMany({
    where: {
      active: true,
      entityId: { in: context.userEntityIds },
    },
  });
  return resp.map((entityGroup) => entityGroup.groupId);
};
