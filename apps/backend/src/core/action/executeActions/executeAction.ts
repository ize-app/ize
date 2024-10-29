import { Prisma } from "@prisma/client";

import { stepInclude } from "@/core/flow/flowPrismaTypes";
import { createRequestPayload } from "@/core/request/createRequestPayload/createRequestPayload";
import { resultGroupInclude } from "@/core/result/resultPrismaTypes";
import { ActionType } from "@/graphql/generated/resolver-types";
import { decrypt } from "@/prisma/encrypt";
import { calculateBackoffMs } from "@/utils/calculateBackoffMs";

import { evolveFlow } from "./evolveFlow";
import { evolveGroup } from "./evolveGroup";
import { groupWatchFlow } from "./groupWatchFlow";
import { triggerNextStep } from "./triggerNextStep";
import { prisma } from "../../../prisma/client";
import { ActionNewPrismaType } from "../actionPrismaTypes";
import { callWebhook } from "../webhook/callWebhook";

export interface ExecuteActionReturn {
  nextRequestStepId: string | null;
  runResultsForNextStep: boolean;
}

// Executes an action if it exists
// since the action is the last execution component of a request step,
// this function is also responsible for determining the final request_step and request statuses
// actions are designed to be retried later if they fail
// returns boolean on whether action will need to be rerun
export const executeAction = async ({
  requestStepId,
  // only includes results from the current ste
}: {
  requestStepId: string;
}): Promise<ExecuteActionReturn> => {
  const defaultReturn: ExecuteActionReturn = {
    nextRequestStepId: null,
    runResultsForNextStep: false,
  };
  try {
    const maxActionRetries = 10;
    // const nextRequestStepId: string | null = null;

    return await prisma.$transaction(async (transaction): Promise<ExecuteActionReturn> => {
      const reqStep = await transaction.requestStep.findFirstOrThrow({
        where: {
          id: requestStepId,
        },
        include: {
          Step: {
            include: stepInclude,
          },
          ResultGroups: {
            include: resultGroupInclude,
          },
          ActionExecution: true,
        },
      });

      const action = reqStep.Step.Action;

      if (!action) {
        await finalizeRequestStep({ requestStepId, transaction });
        return defaultReturn;
      }

      // if the action filter isn't passed, end the request step and request
      if (action.filterOptionId) {
        let passesFilter = false;
        for (const result of reqStep.ResultGroups) {
          const primaryResults = result.Result.filter((r) => r.index === 0);
          if (
            primaryResults.some((res) =>
              res.ResultItems.some((val) => val.fieldOptionId === action.filterOptionId),
            )
          ) {
            passesFilter = true;
            break;
          }
        }
        if (!passesFilter) {
          // end request step without taking an action
          await finalizeRequestStep({ requestStepId, transaction, action });
          return defaultReturn;
        }
      }

      const actionExecution = reqStep.ActionExecution.find((a) => a.actionId === action.id);

      if (actionExecution) {
        // this should never evaluate to true, but just in case
        if (actionExecution.final) {
          await finalizeRequestStep({ requestStepId, transaction, action });
          return defaultReturn;
        }

        // if the action has been attempted too many times, mark it as final
        if ((actionExecution?.retryAttempts ?? 0) > maxActionRetries) {
          await prisma.actionExecution.update({
            where: {
              actionId_requestStepId: {
                actionId: action.id,
                requestStepId: requestStepId,
              },
            },
            data: {
              complete: false,
              final: true,
            },
          });

          await finalizeRequestStep({ requestStepId, transaction, action });
          return defaultReturn;
        }

        // check if action is ready to be retried again, if not return existing incomplete result
        if (actionExecution.nextRetryAt && actionExecution.nextRetryAt > new Date()) {
          return defaultReturn;
        }
      }

      try {
        let nextRequestStepId: string | null = null;
        let runResultsForNextStep = false;
        switch (action.type) {
          case ActionType.CallWebhook: {
            if (!action.Webhook) throw Error("");
            const payload = await createRequestPayload({ requestStepId });
            const uri = decrypt(action.Webhook.uri);
            await callWebhook({ uri, payload });
            break;
          }
          case ActionType.TriggerStep: {
            const res = await triggerNextStep({ requestStepId, transaction });
            nextRequestStepId = res.nextRequestStepId;
            runResultsForNextStep = res.runResultsForNextStep;
            break;
          }
          case ActionType.EvolveFlow: {
            await evolveFlow({ requestStepId, transaction });
            break;
          }
          case ActionType.GroupWatchFlow: {
            await groupWatchFlow({ requestStepId, transaction });
            break;
          }
          case ActionType.EvolveGroup:
            await evolveGroup({ requestStepId, transaction });
            break;
          default:
            break;
        }

        await transaction.actionExecution.upsert({
          where: {
            actionId_requestStepId: {
              actionId: action.id,
              requestStepId: requestStepId,
            },
          },
          update: {
            complete: true,
            final: true,
            lastAttemptedAt: new Date(),
          },
          create: {
            actionId: action.id,
            requestStepId,
            complete: true,
            final: true,
            lastAttemptedAt: new Date(),
          },
        });

        await finalizeRequestStep({ requestStepId, transaction, action });


        return { nextRequestStepId, runResultsForNextStep } as ExecuteActionReturn;
      } catch (e) {
        const retryAttempts = actionExecution?.retryAttempts ?? 1;
        const nextRetryAt = new Date(Date.now() + calculateBackoffMs(retryAttempts));
        await transaction.actionExecution.upsert({
          where: {
            actionId_requestStepId: {
              actionId: action.id,
              requestStepId: requestStepId,
            },
          },
          create: {
            actionId: action.id,
            requestStepId,
            complete: false,
            final: false,
            lastAttemptedAt: new Date(),
            nextRetryAt,
            retryAttempts,
          },
          update: {
            lastAttemptedAt: new Date(),
            retryAttempts,
            nextRetryAt,
          },
        });
        return defaultReturn;
      }
    });
  } catch (error) {
    console.error("Error in executeAction:", error);
    return defaultReturn;
  }
};

const finalizeRequestStep = async ({
  requestStepId,
  transaction,
  action,
}: {
  requestStepId: string;
  action?: ActionNewPrismaType;
  transaction: Prisma.TransactionClient;
}) => {
  const isTriggerAction = action?.type === ActionType.TriggerStep;
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
        isTriggerAction
          ? {}
          : {
              update: {
                final: true,
              },
            },
    },
  });
};
