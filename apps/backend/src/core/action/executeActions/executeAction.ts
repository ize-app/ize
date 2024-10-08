import { Prisma } from "@prisma/client";

import { stepInclude } from "@/core/flow/flowPrismaTypes";
import { resultInclude } from "@/core/result/resultPrismaTypes";
import { ActionType } from "@/graphql/generated/resolver-types";
import { decrypt } from "@/prisma/encrypt";
import { calculateBackoffMs } from "@/utils/calculateBackoffMs";

import { evolveFlow } from "./evolveFlow";
import { evolveGroup } from "./evolveGroup";
import { groupWatchFlow } from "./groupWatchFlow";
import { triggerNextStep } from "./triggerNextStep";
import { prisma } from "../../../prisma/client";
import { createNotificationPayload } from "../../notification/createNotificationPayload/createNotificationPayload";
import { ActionNewPrismaType } from "../actionPrismaTypes";
import { callWebhook } from "../webhook/callWebhook";

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
}) => {
  try {
    const maxActionRetries = 10;

    await prisma.$transaction(async (transaction) => {
      const reqStep = await transaction.requestStep.findFirstOrThrow({
        where: {
          id: requestStepId,
        },
        include: {
          Step: {
            include: stepInclude,
          },
          Results: {
            include: resultInclude,
          },
          ActionExecution: true,
        },
      });

      const action = reqStep.Step.Action;

      if (!action) {
        await finalizeRequestStep({ requestStepId, transaction });
        return;
      }

      // if the action filter isn't passed, end the request step and request
      if (action.filterOptionId) {
        let passesFilter = false;
        for (const result of reqStep.Results) {
          if (result.ResultItems.some((val) => val.fieldOptionId === action.filterOptionId)) {
            passesFilter = true;
            break;
          }
        }
        if (!passesFilter) {
          // end request step without taking an action
          await finalizeRequestStep({ requestStepId, transaction, action });
          return;
        }
      }

      const actionExecution = reqStep.ActionExecution.find((a) => a.actionId === action.id);

      if (actionExecution) {
        // this should never evaluate to true, but just in case
        if (actionExecution.final) {
          await finalizeRequestStep({ requestStepId, transaction, action });
          return;
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
          return;
        }

        // check if action is ready to be retried again, if not return existing incomplete result
        if (actionExecution.nextRetryAt && actionExecution.nextRetryAt > new Date()) {
          return;
        }
      }

      try {
        switch (action.type) {
          case ActionType.CallWebhook: {
            if (!action.Webhook) throw Error("");
            const payload = await createNotificationPayload({ requestStepId, transaction });
            const uri = decrypt(action.Webhook.uri);
            await callWebhook({ uri, payload });
            break;
          }
          case ActionType.TriggerStep: {
            await triggerNextStep({ requestStepId });
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

        return;
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
        return;
      }
    });
  } catch (error) {
    console.error("Error in executeAction:", error);
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
