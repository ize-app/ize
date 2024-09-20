import { Prisma } from "@prisma/client";

import { StepPrismaType } from "@/core/flow/flowPrismaTypes";
import { ResultPrismaType } from "@/core/result/resultPrismaTypes";
import { ActionType } from "@/graphql/generated/resolver-types";
import { decrypt } from "@/prisma/encrypt";

import { evolveFlow } from "./evolveFlow";
import { evolveGroup } from "./evolveGroup";
import { groupWatchFlow } from "./groupWatchFlow";
import { triggerNextStep } from "./triggerNextStep";
import { prisma } from "../../../prisma/client";
import { callWebhook } from "../webhook/callWebhook";
import { createWebhookPayload } from "../webhook/createWebhookPayload";

// Executes an action if it exists
// since the action is the last execution component of a request step,
// this function is also responsible for determining the final request_step and request statuses
// actions are designed to be retried later if they fail
// returns boolean on whether action will need to be rerun
export const executeAction = async ({
  requestStepId,
  step,
  // only includes results from the current step
  results,
  transaction = prisma,
}: {
  requestStepId: string;
  step: StepPrismaType;
  results: ResultPrismaType[];
  transaction: Prisma.TransactionClient;
}): Promise<boolean> => {
  const action = step.Action;
  // if no action, assume the
  if (!action) {
    await transaction.requestStep.update({
      where: {
        id: requestStepId,
      },
      data: {
        actionsComplete: true,
        final: true,
        Request: {
          update: {
            final: true,
          },
        },
      },
    });
    return true;
  }

  let actionComplete = false;

  // if the action filter isn't passed, end the request step and request
  if (action.filterOptionId) {
    let passesFilter = false;
    for (const result of results) {
      if (result.ResultItems.some((val) => val.fieldOptionId === action.filterOptionId)) {
        passesFilter = true;
        break;
      }
    }
    if (!passesFilter) {
      await transaction.requestStep.update({
        where: {
          id: requestStepId,
        },
        data: {
          actionsComplete: true,
          final: true,
          Request: {
            update: {
              final: true,
            },
          },
        },
      });
      return true;
    }
  }

  switch (action.type) {
    case ActionType.CallWebhook: {
      if (!action.Webhook) throw Error("");
      const payload = await createWebhookPayload({ requestStepId, transaction });
      const uri = decrypt(action.Webhook.uri);
      if (payload) {
        actionComplete = await callWebhook({ uri, payload });
      }
      break;
    }
    case ActionType.TriggerStep: {
      actionComplete = await triggerNextStep({ requestStepId });
      break;
    }
    case ActionType.EvolveFlow: {
      actionComplete = await evolveFlow({ requestStepId, transaction });
      break;
    }
    case ActionType.GroupWatchFlow: {
      actionComplete = await groupWatchFlow({ requestStepId, transaction });
      break;
    }
    case ActionType.EvolveGroup:
      actionComplete = await evolveGroup({ requestStepId, transaction });
      break;
    default:
      actionComplete = false;
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
      complete: actionComplete,
      lastAttemptedAt: new Date(),
    },
    create: {
      actionId: action.id,
      requestStepId,
      complete: actionComplete,
    },
  });

  // update request step with whether actions are complete
  await transaction.requestStep.update({
    where: {
      id: requestStepId,
    },
    data: {
      actionsComplete: actionComplete,
      final: actionComplete,
      Request:
        // since there is currently only one action per request step
        // we can assume the request is complete if the action is complete
        // unless the action is to trigger another step
        action.type !== ActionType.TriggerStep
          ? {
              update: {
                final: actionComplete,
              },
            }
          : {},
    },
  });

  return actionComplete;
};
