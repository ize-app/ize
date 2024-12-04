import { prisma } from "@/prisma/client";

export const finalizeRequestStepForFailedResults = async ({
  requestStepId,
}: {
  requestStepId: string;
}) => {
  await prisma.requestStep.update({
    where: {
      id: requestStepId,
    },
    data: {
      resultsFinal: true,
      actionsFinal: true,
      final: true,
      // since there is currently only one action per request step
      Request: {
        update: {
          final: true,
        },
      },
    },
  });
};
