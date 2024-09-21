import { sendNewStepNotifications } from "@/core/notification/sendNewStepNotifications";
import { createRequestDefinedOptionSet } from "@/core/request/createRequestDefinedOptionSet";
import { requestInclude } from "@/core/request/requestPrismaTypes";
import { FieldDataType, FieldOptionArgs } from "@/graphql/generated/resolver-types";
import { ApolloServerErrorCode, GraphQLError } from "@graphql/errors";

import { prisma } from "../../../prisma/client";

export const triggerNextStep = async ({
  requestStepId,
}: {
  requestStepId: string;
}): Promise<boolean> => {
  try {
    const flowId = await prisma.$transaction(async (transaction) => {
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

      const nextStep = reqData.Request.FlowVersion.Steps.find((s) => s.index === nextStepIndex);

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

      // trigger the next step if it exists
      const nextRequestStep = await transaction.requestStep.create({
        data: {
          expirationDate: new Date(
            new Date().getTime() + (nextStep.expirationSeconds as number) * 1000,
          ),
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
        },
      });

      // for each field, see if there are linked results
      // then find those results in the previous request steps and create a requestDefinedOptionSet for that field
      (nextStep.ResponseFieldSet?.FieldSetFields ?? []).map((f) => {
        const linkedResults = f.Field.FieldOptionsConfigs?.linkedResultOptions;
        if (linkedResults) {
          linkedResults.forEach((resultConfigId) => {
            // iterate through all request Steps's results to find results associated with the linked result config id
            reqData.Request.RequestSteps.forEach(async (rs) => {
              const result = rs.Results.find((r) => r.resultConfigId === resultConfigId);
              if (!result) {
                throw new GraphQLError(
                  `Cannot find result for resultConfigId ${resultConfigId} in requestStepId ${rs.id}`,
                  {
                    extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
                  },
                );
              }
              const newOptionArgs: FieldOptionArgs[] = result.ResultItems.map((ri) => {
                return {
                  dataType: ri.dataType as unknown as FieldDataType,
                  name: ri.value,
                };
              });

              return await createRequestDefinedOptionSet({
                step: nextStep,
                requestStepId: nextRequestStep.id,
                newOptionArgs,
                fieldId: f.Field.id,
                isTriggerDefinedOptions: false,
                transaction,
              });
            });
          });
        }
      });

      await transaction.request.update({
        where: {
          id: reqData.requestId,
        },
        data: {
          currentRequestStepId: nextRequestStep.id,
        },
      });

      return reqData.Request.FlowVersion.flowId;
    });

    sendNewStepNotifications({
      flowId,
      requestStepId,
    });

    return true;
  } catch (e) {
    return false;
  }
};
