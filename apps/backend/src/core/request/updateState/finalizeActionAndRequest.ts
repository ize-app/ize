import { Prisma } from "@prisma/client";

import { prisma } from "@/prisma/client";

export const finalizeActionAndRequest = async ({
  requestStepId,
  transaction = prisma,
  finalizeRequest,
}: {
  requestStepId: string;

  transaction?: Prisma.TransactionClient;
  finalizeRequest: boolean;
}) => {
  await transaction.requestStep.update({
    where: {
      id: requestStepId,
    },
    data: {
      actionsFinal: true,
      final: true,
      // since there is currently only one action per request step
      Request:
        // we can assume the request is complete if the action is complete
        // unless the action is to trigger another step
        finalizeRequest
          ? {
              update: {
                final: true,
              },
            }
          : {},
    },
  });
};
