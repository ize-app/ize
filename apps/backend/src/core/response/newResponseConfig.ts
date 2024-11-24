import { Prisma } from "@prisma/client";

import { newPermission } from "@/core/permission/newPermission";
import { ResponseConfigArgs } from "@/graphql/generated/resolver-types";

export const newResponseConfig = async ({
  args,
  stepId,
  transaction,
}: {
  args: ResponseConfigArgs | undefined | null;
  stepId: string;
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

  const responseConfig = await transaction.responseConfig.create({
    data: {
      stepId,
      allowMultipleResponses,
      canBeManuallyEnded,
      expirationSeconds,
      minResponses,
    },
  });

  await newPermission({
    permission,
    transaction,
    type: "response",
    responseConfigId: responseConfig.id,
  });

  return responseConfig.id;
};
