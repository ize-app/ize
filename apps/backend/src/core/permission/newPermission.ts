import { Prisma } from "@prisma/client";

import { PermissionArgs } from "@/graphql/generated/resolver-types";

export const newPermission = async ({
  permission: args,
  stepIndex,
  transaction,
}: {
  permission: PermissionArgs;
  stepIndex: number;
  transaction: Prisma.TransactionClient;
}): Promise<string> => {
  let entitySetId = undefined;

  if (!!args.entities && args.entities.length > 0) {
    const entitySet = await transaction.entitySet.create({
      data: {
        EntitySetEntities: {
          createMany: {
            data: args.entities.map((entity) => ({ entityId: entity.id })),
          },
        },
      },
    });
    entitySetId = entitySet.id;
  }

  const permission = await transaction.permission.create({
    data: {
      anyone: args.anyone,
      entitySetId,
      userId: args.userId,
    },
  });

  return permission.id;
};
