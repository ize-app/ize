import { executeAction } from "../core/action/executeActions/executeAction";
import { prisma } from "../prisma/client";

// get all actions where result is final but action is not complete
// retry all failed actions
export const retryActions = async () => {
  try {
    //  check if there are any request steps that don't have completed actions
    const stepsWithoutActions = await prisma.requestStep.findMany({
      where: {
        resultsFinal: true,
        actionsFinal: false,
        final: false,
      },
    });

    // retry incomplete actions
    await Promise.all(
      stepsWithoutActions.map(async (reqStep) => {
        await executeAction({
          requestStepId: reqStep.id,
        });
      }),
    );
  } catch (error) {
    console.error("Error in retryActions:", error);
  }
};
