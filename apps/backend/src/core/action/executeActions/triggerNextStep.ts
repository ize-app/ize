import { ActionType, Prisma } from "@prisma/client";

import { createRequestDefinedOptionSet } from "@/core/request/createRequestDefinedOptionSet";
import { requestInclude } from "@/core/request/requestPrismaTypes";
import { canEndRequestStepWithResponse } from "@/core/request/utils/endRequestStepWithoutResponse";
import { ResultPrismaType } from "@/core/result/resultPrismaTypes";
import { ApolloServerErrorCode, GraphQLError } from "@graphql/errors";

import { ExecuteActionReturn } from "./executeAction";

export const triggerNextStep = async ({
  requestStepId,
  transaction,
}: {
  requestStepId: string;
  transaction: Prisma.TransactionClient;
}): Promise<ExecuteActionReturn> => {
  // get the id of the next step and request
  const reqData = await transaction.requestStep.findFirst({
    where: {
      id: requestStepId,
    },
    include: {
      Request: {
        include: requestInclude,
      },
      Step: true,
    },
  });

  if (!reqData) {
    throw new GraphQLError(`Cannot find requestStepId ${requestStepId}`, {
      extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
    });
  }

  const nextStepIndex = reqData.Step.index + 1;

  const currStep = reqData.Request.FlowVersion.Steps.find((s) => s.id === reqData.Step.id);
  // once we implement multiple actions per step, this will need to be updated
  const nextStepId = currStep?.ActionConfigSet?.ActionConfigs.find(
    (ac) => ac.type === ActionType.TriggerStep,
  )?.ActionConfigTriggerStep?.stepId;
  const nextStep = reqData.Request.FlowVersion.Steps.find((s) => s.id === nextStepId);

  // maybe add this back as a second check until we get multiple steps?
  // const nextStep = reqData.Request.FlowVersion.Steps.find((s) => s.index === nextStepIndex);

  if (!nextStep) {
    throw new GraphQLError(
      `Next step action was triggered but there is no step for flowVersion ${
        reqData.Request.FlowVersion.id
      }, request ${reqData.requestId}, and index ${nextStepIndex.toString()}`,
      {
        extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
      },
    );
  }

  const responseComplete = canEndRequestStepWithResponse({ step: nextStep });

  const nextRequestStep = await transaction.requestStep.create({
    data: {
      expirationDate: new Date(
        new Date().getTime() + (nextStep.ResponseConfig?.expirationSeconds ?? 0) * 1000,
      ),
      responseFinal: false,
      Request: {
        connect: {
          id: reqData.requestId,
        },
      },
      Step: {
        connect: {
          id: nextStep.id,
        },
      },
      CurrentStepParent: {
        connect: {
          id: reqData.requestId,
        },
      },
      TriggeredByRequestStep: {
        connect: {
          id: requestStepId,
        },
      },
      // triggeredByRequestStepId: requestStepId,
    },
  });

  const linkedResults = new Map<{ resultConfigId: string; fieldId: string }, string[]>();

  (nextStep.ResponseFieldSet?.Fields ?? []).forEach((f) => {
    const linkedResultConfigIds = (f.FieldOptionsConfig?.FieldOptionsConfigLinkedResults ?? []).map(
      (r) => r.resultConfigId,
    );
    if (linkedResultConfigIds.length > 0) {
      linkedResultConfigIds.forEach((resultConfigId) => {
        let result: ResultPrismaType | undefined = undefined;

        /// find corresponding result to each linked result config id
        for (const rs of reqData.Request.RequestSteps) {
          const resultGroup = rs.ResultGroups.find((r) => r.resultConfigId === resultConfigId);
          if (resultGroup) {
            result = resultGroup.Result.find((r) => r.index === 0);
            break;
          }
        }

        // if there is no result, just don't create a linked result set
        // tbd if should throw an error
        if (!result) return;

        const newOptionArgs: string[] = result.ResultItems.map((ri) => ri.valueId);

        linkedResults.set({ resultConfigId, fieldId: f.id }, newOptionArgs);
      });
    }
  });

  await Promise.all(
    Array.from(linkedResults.entries()).map(async ([{ fieldId }, valueIds]) => {
      return await createRequestDefinedOptionSet({
        type: "result",
        requestId: reqData.requestId,
        valueIds,
        fieldId,
        transaction,
      });
    }),
  );

  await transaction.request.update({
    where: {
      id: reqData.requestId,
    },
    data: {
      currentRequestStepId: nextRequestStep.id,
    },
  });

  // note: not running results or finalizing responses on request step in this function
  // because we don't want to create nested transactions
  return {
    responseComplete: responseComplete,
    nextRequestStepId: nextRequestStep.id,
  };
};
