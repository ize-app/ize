import { PermissionArgs } from "@/graphql/generated/resolver-types";
import { Prisma } from "@prisma/client";

export const newPermission = async ({
  permission: args,
  transaction,
}: {
  permission: PermissionArgs;
  transaction: Prisma.TransactionClient;
}): Promise<string | null> => {
  let entitySetId = undefined;
  console.log("entities are ", args.entities);

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
    },
  });

  return permission.id;
};
