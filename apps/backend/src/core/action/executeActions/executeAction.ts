import { StepPrismaType } from "@/core/flow/flowPrismaTypes";
import { ResultPrismaType } from "@/core/result/resultPrismaTypes";
import { ActionType } from "@/graphql/generated/resolver-types";
import { triggerNextStep } from "./triggerNextStep";
import { callWebhook } from "../webhook/callWebhook";
import { prisma } from "../../../prisma/client";
import { evolveFlow } from "./evolveFlow";
import { createWebhookPayload } from "../webhook/createWebhookPayload";
import { Prisma } from "@prisma/client";

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
  transaction?: Prisma.TransactionClient;
}): Promise<boolean> => {
  const action = step.Action;
  // if no action, assume the
  if (!action) {
    await prisma.requestStep.update({
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
    for (let result of results) {
      if (result.ResultItems.some((val) => val.fieldOptionId === action.filterOptionId)) {
        passesFilter = true;
        break;
      }
    }
    if (!passesFilter) {
      await prisma.requestStep.update({
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
      actionComplete = await callWebhook({ uri: action.Webhook.uri, payload });
      break;
    }
    case ActionType.TriggerStep: {
      actionComplete = await triggerNextStep({ requestStepId, transaction });
      break;
    }
    case ActionType.EvolveFlow: {
      actionComplete = await evolveFlow();
      break;
    }
    default:
      actionComplete = false;
      break;
  }

  await prisma.actionExecution.upsert({
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
  await prisma.requestStep.update({
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
