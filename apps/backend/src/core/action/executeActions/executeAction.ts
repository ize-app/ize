import { stepInclude } from "@/core/flow/flowPrismaTypes";
import { resultInclude } from "@/core/result/resultPrismaTypes";
import { ActionType } from "@/graphql/generated/resolver-types";
import { decrypt } from "@/prisma/encrypt";

import { evolveFlow } from "./evolveFlow";
import { evolveGroup } from "./evolveGroup";
import { groupWatchFlow } from "./groupWatchFlow";
import { triggerNextStep } from "./triggerNextStep";
import { prisma } from "../../../prisma/client";
import { createNotificationPayload } from "../../notification/createNotificationPayload/createNotificationPayload";
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
        },
      });

      const action = reqStep.Step.Action;
      // if no action, assume the
      if (!action) {
        await transaction.requestStep.update({
          where: {
            id: requestStepId,
          },
          data: {
            actionsFinal: true,
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

      let actionsFinal = false;

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
          await transaction.requestStep.update({
            where: {
              id: requestStepId,
            },
            data: {
              actionsFinal: true,
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
          const payload = await createNotificationPayload({ requestStepId, transaction });
          const uri = decrypt(action.Webhook.uri);
          if (payload) {
            actionsFinal = await callWebhook({ uri, payload });
          }
          break;
        }
        case ActionType.TriggerStep: {
          actionsFinal = await triggerNextStep({ requestStepId });
          break;
        }
        case ActionType.EvolveFlow: {
          actionsFinal = await evolveFlow({ requestStepId, transaction });
          break;
        }
        case ActionType.GroupWatchFlow: {
          actionsFinal = await groupWatchFlow({ requestStepId, transaction });
          break;
        }
        case ActionType.EvolveGroup:
          actionsFinal = await evolveGroup({ requestStepId, transaction });
          break;
        default:
          actionsFinal = false;
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
          complete: actionsFinal,
          lastAttemptedAt: new Date(),
        },
        create: {
          actionId: action.id,
          requestStepId,
          complete: actionsFinal,
        },
      });

      // update request step with whether actions are complete
      await transaction.requestStep.update({
        where: {
          id: requestStepId,
        },
        data: {
          actionsFinal: actionsFinal,
          final: actionsFinal,
          Request:
            // since there is currently only one action per request step
            // we can assume the request is complete if the action is complete
            // unless the action is to trigger another step
            action.type !== ActionType.TriggerStep
              ? {
                  update: {
                    final: actionsFinal,
                  },
                }
              : {},
        },
      });

      return actionsFinal;
    });
  } catch (error) {
    console.error("Error in executeAction:", error);
  }
};
