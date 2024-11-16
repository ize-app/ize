import { Prisma } from "@prisma/client";

import { newPermission } from "@/core/permission/newPermission";
import { ResponseConfigArgs } from "@/graphql/generated/resolver-types";

export const newResponseConfig = async ({
  args,
  transaction,
}: {
  args: ResponseConfigArgs | undefined | null;
  transaction: Prisma.TransactionClient;
}): Promise<string | null> => {
  if (!args) return null;

  const {
    canBeManuallyEnded,
    allowMultipleResponses,
    expirationSeconds,
    permission,
    minResponses,
  } = args;

  const responsePermissionsId = await newPermission({
    permission,
    transaction,
  });

  const responseConfig = await transaction.responseConfig.create({
    data: {
      permissionsId: responsePermissionsId,
      allowMultipleResponses,
      canBeManuallyEnded,
      expirationSeconds,
      minResponses,
    },
  });

  return responseConfig.id;
};
