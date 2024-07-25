import { Prisma } from "@prisma/client";

import { EntityArgs } from "@/graphql/generated/resolver-types";

export const newEntitySet = async ({
  entityArgs,
  transaction,
}: {
  entityArgs: EntityArgs[];
  transaction: Prisma.TransactionClient;
}): Promise<string> => {
  const entitySet = await transaction.entitySet.create({
    data: {
      EntitySetEntities: {
        createMany: {
          data: entityArgs.map((entity) => ({ entityId: entity.id })),
        },
      },
    },
  });
  return entitySet.id;
};
