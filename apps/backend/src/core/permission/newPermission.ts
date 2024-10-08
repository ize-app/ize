import { Prisma } from "@prisma/client";

import { PermissionArgs } from "@/graphql/generated/resolver-types";

import { newEntitySet } from "../entity/newEntitySet";

export const newPermission = async ({
  permission: args,
  transaction,
}: {
  permission: PermissionArgs;
  stepIndex: number;
  transaction: Prisma.TransactionClient;
}): Promise<string> => {
  let entitySetId = undefined;

  if (!!args.entities && args.entities.length > 0) {
    entitySetId = await newEntitySet({ entityArgs: args.entities, transaction });
  }

  const permission = await transaction.permission.create({
    data: {
      // in case args.anyone is true  even though there are entity permissions set
      anyone: args.anyone && !entitySetId && !args.userId,
      entitySetId,
      userId: args.userId,
    },
  });

  return permission.id;
};
