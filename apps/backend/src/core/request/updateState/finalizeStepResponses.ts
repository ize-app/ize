import { prisma } from "@/prisma/client";

import { finalizeStepResults } from "./finalizeStepResults";

export const finalizeStepResponses = async ({ requestStepId }: { requestStepId: string }) => {
  await prisma.requestStep.update({
    where: {
      id: requestStepId,
    },
    data: {
      responseFinal: true,
    },
  });

  await finalizeStepResults({ requestStepId });
};
