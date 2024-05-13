import { StepPrismaType } from "@/core/flow/flowPrismaTypes";
import { ResultPrismaType } from "@/core/result/resultPrismaTypes";
import { ActionType } from "@/graphql/generated/resolver-types";
import { triggerNextStep } from "./triggerNextStep";
import { callWebhook } from "../webhook/callWebhook";
import { prisma } from "../../../prisma/client";
import { evolveFlow } from "./evolveFlow";
import { createWebhookPayload } from "../webhook/createWebhookPayload";
import { Prisma } from "@prisma/client";

// return true if all actions executed successfully
export const executeAction = async ({
  requestStepId,
  step,
  results,
  transaction = prisma,
}: {
  requestStepId: string;
  step: StepPrismaType;
  results: ResultPrismaType[];
  transaction?: Prisma.TransactionClient;
}): Promise<boolean> => {
  const action = step.Action;
  if (!action) return true;

  //// if filter, check if decision before running action
  if (action.filterOptionId) {
    const matchActionFilter = results.some((result) =>
      result.ResultItems.some((item) => item.fieldOptionId === action.filterOptionId),
    );
    if (!matchActionFilter) return true;
  }

  let actionComplete = false;

  //// if webhook, trigger webhook, with retry logic
  switch (action.type) {
    case ActionType.CallWebhook: {
      if (!action.Webhook) throw Error("");
      const payload = await createWebhookPayload({ requestStepId, transaction });
      actionComplete = await callWebhook({ uri: action.Webhook.uri, payload });
      break;
    }
    case ActionType.TriggerStep: {
      actionComplete = await triggerNextStep({});
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
    },
  });

  return actionComplete;
};
