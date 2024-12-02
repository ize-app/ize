import { createWebhookPayload } from "@/core/action/webhook/createWebhookPayload";
import { stepInclude } from "@/core/flow/flowPrismaTypes";
import { finalizeActionAndRequest } from "@/core/request/updateState/finalizeActionAndRequest";
import { resultGroupInclude } from "@/core/result/resultPrismaTypes";
import { ActionType } from "@/graphql/generated/resolver-types";
import { decrypt } from "@/prisma/encrypt";
import { calculateBackoffMs } from "@/utils/calculateBackoffMs";

import { evolveFlow } from "./evolveFlow";
import { evolveGroup } from "./evolveGroup";
import { groupWatchFlow } from "./groupWatchFlow";
import { triggerNextStep } from "./triggerNextStep";
import { prisma } from "../../../prisma/client";
import { callWebhook } from "../webhook/callWebhook";

export interface ExecuteActionReturn {
  nextRequestStepId: string | null;
  responseComplete: boolean;
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
    responseComplete: false,
  };
  try {
    const maxActionRetries = 10;
    // const nextRequestStepId: string | null = null;
    const reqStep = await prisma.requestStep.findFirstOrThrow({
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
        Actions: true,
      },
    });

    const action = reqStep.Step.ActionConfigSet?.ActionConfigs[0];

    if (!action) {
      await finalizeActionAndRequest({ requestStepId, finalizeRequest: true });
      return defaultReturn;
    }

    const actionFilter = action.ActionConfigFilter;
    // if the action filter isn't passed, end the request step and request
    if (actionFilter) {
      const result = reqStep.ResultGroups.find(
        (r) => r.resultConfigId === actionFilter.resultConfigId,
      );
      const passesFilter = result?.Result[0].ResultItems.some(
        (val) => val.fieldOptionId === actionFilter.optionId,
      );

      if (!passesFilter) {
        // end request step without taking an action
        await finalizeActionAndRequest({ requestStepId, finalizeRequest: true });
        return defaultReturn;
      }
    }

    const actionExecution = reqStep.Actions.find((a) => a.actionConfigId === action.id);

    if (actionExecution) {
      // this should never evaluate to true, but just in case so action doesn't run again
      if (actionExecution.complete) {
        await finalizeActionAndRequest({ requestStepId, finalizeRequest: true });
        return defaultReturn;
      }

      // if the action has been attempted too many times, mark it as final
      if ((actionExecution?.retryAttempts ?? 0) > maxActionRetries) {
        return await prisma.$transaction(async (transaction): Promise<ExecuteActionReturn> => {
          await prisma.action.update({
            where: {
              actionConfigId_requestStepId: {
                actionConfigId: action.id,
                requestStepId: requestStepId,
              },
            },
            data: {
              complete: false,
            },
          });

          await finalizeActionAndRequest({ requestStepId, transaction, finalizeRequest: true });
          return defaultReturn;
        });
      }

      // check if action is ready to be retried again, if not return existing incomplete result
      if (actionExecution.nextRetryAt && actionExecution.nextRetryAt > new Date()) {
        return defaultReturn;
      }
    }

    try {
      return await prisma.$transaction(async (transaction): Promise<ExecuteActionReturn> => {
        let nextRequestStepId: string | null = null;
        let runResultsForNextStep = false;
        switch (action.type) {
          case ActionType.CallWebhook: {
            if (!action.ActionConfigWebhook) throw Error("");
            const payload = await createWebhookPayload({ requestStepId });
            const uri = decrypt(action.ActionConfigWebhook.uri);
            await callWebhook({ uri, payload });
            break;
          }
          case ActionType.TriggerStep: {
            const res = await triggerNextStep({ requestStepId, transaction });
            nextRequestStepId = res.nextRequestStepId;
            runResultsForNextStep = res.responseComplete;
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

        await transaction.action.upsert({
          where: {
            actionConfigId_requestStepId: {
              actionConfigId: action.id,
              requestStepId: requestStepId,
            },
          },
          update: {
            complete: true,

            lastAttemptedAt: new Date(),
          },
          create: {
            actionConfigId: action.id,
            requestStepId,
            complete: true,
            lastAttemptedAt: new Date(),
          },
        });

        await finalizeActionAndRequest({
          requestStepId,
          transaction,
          // Don't finalize request if there's another step to trigger
          finalizeRequest: !nextRequestStepId,
        });

        return {
          nextRequestStepId,
          responseComplete: runResultsForNextStep,
        } as ExecuteActionReturn;
      });
    } catch (e) {
      const retryAttempts = actionExecution?.retryAttempts ?? 1;
      const nextRetryAt = new Date(Date.now() + calculateBackoffMs(retryAttempts));
      await prisma.action.upsert({
        where: {
          actionConfigId_requestStepId: {
            actionConfigId: action.id,
            requestStepId: requestStepId,
          },
        },
        create: {
          actionConfigId: action.id,
          requestStepId,
          complete: false,
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
  } catch (error) {
    console.error("Error in executeAction:", error);
    return defaultReturn;
  }
};
