import { stepInclude } from "@/core/flow/flowPrismaTypes";
import { ApolloServerErrorCode, CustomErrorCodes, GraphQLError } from "@graphql/errors";
import { MutationNewResponseArgs } from "@graphql/generated/resolver-types";

import { prisma } from "../../prisma/client";
import { getUserEntities } from "../entity/getUserEntities";
import { UserOrIdentityContextInterface } from "../entity/UserOrIdentityContext";
import { fieldAnswerInclude, fieldOptionSetInclude } from "../fields/fieldPrismaTypes";
import { newFieldAnswers } from "../fields/newFieldAnswers";
import { getEntityPermissions } from "../permission/getEntityPermissions";
import { finalizeStepResponses } from "../request/updateState/finalizeStepResponses";
import { checkToEndResponseEarly } from "../result/checkIfEarlyResult";
import { newResultsForStep } from "../result/newResults/newResultsForStep";
import { watchFlow } from "../user/watchFlow";

interface NewResponseProps {
  entityContext: UserOrIdentityContextInterface;
  args: MutationNewResponseArgs;
}

// creates a new response for a given request step
// validates/creates field answers
export const newResponse = async ({ entityContext, args }: NewResponseProps): Promise<string> => {
  const {
    response: { answers, requestStepId },
  } = args;

  const responseId = await prisma.$transaction(async (transaction) => {
    const requestStep = await transaction.requestStep.findUniqueOrThrow({
      where: {
        id: requestStepId,
      },
      include: {
        Step: {
          include: stepInclude,
        },
        Request: {
          include: {
            FlowVersion: true,
            TriggerFieldAnswers: {
              include: fieldAnswerInclude,
            },
            RequestDefinedOptionSets: {
              include: {
                FieldOptionSet: {
                  include: fieldOptionSetInclude,
                },
              },
            },
          },
        },
      },
    });

    if (requestStep.id !== requestStep.Request.currentRequestStepId)
      throw new GraphQLError(
        "User is trying to submit response for request step that is not the current request step.",
        {
          extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
        },
      );

    if (requestStep.responseFinal || requestStep.final || requestStep.Request.final)
      throw new GraphQLError(
        "Response received for reqeust step that is no longer accepting responses",
        {
          extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
        },
      );

    if (!requestStep.Step.ResponseFieldSet || requestStep.Step.ResponseFieldSet.Fields.every((f) => f.isInternal))
      throw new GraphQLError(
        `Response received for request step that does not have response fields ${requestStepId}`,
        {
          extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
        },
      );

    if (!requestStep.Step.ResponseConfig)
      throw new GraphQLError(
        `Response received for request step that does not accept responses ${requestStepId}`,
        {
          extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
        },
      );

    const { allowMultipleResponses, ResponsePermissions } = requestStep.Step.ResponseConfig;

    const hasRespondPermissions = await getEntityPermissions({
      entityContext,
      permission: ResponsePermissions,
      transaction,
    });

    const { entityId, entityIds, user } = await getUserEntities({ entityContext, transaction });

    if (!hasRespondPermissions) {
      throw new GraphQLError("User does not have permission to respond", {
        extensions: { code: CustomErrorCodes.InsufficientPermissions },
      });
    }

    const existingUserResponse = await transaction.response.findFirst({
      where: {
        requestStepId,
        creatorEntityId: { in: entityIds },
      },
    });

    if (!allowMultipleResponses) {
      if (existingUserResponse)
        throw new GraphQLError(
          `Response already exists for this request step. requestStepId: ${requestStepId}`,
          {
            extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
          },
        );
    }

    const newResponse = await transaction.response.create({
      data: {
        id: args.response.responseId,
        creatorEntityId: entityId,
        requestStepId,
      },
    });

    await newFieldAnswers({
      fieldSet: requestStep.Step.ResponseFieldSet,
      fieldAnswers: answers,
      requestDefinedOptionSets: requestStep.Request.RequestDefinedOptionSets,
      responseId: newResponse.id,
      transaction,
    });

    await watchFlow({
      flowId: requestStep.Request.FlowVersion.flowId,
      watch: true,
      entityId,
      transaction,
      user,
    });

    return newResponse.id;
  });

  // perliminary results are determined after every response
  // not running results and actions on the same transaction so that vote can be recorded if there is issue with action / result
  // there is cron job to rerun stalled actions / results
  await newResultsForStep({ requestStepId });

  const hasEarlyResult = await checkToEndResponseEarly({ requestStepId });

  if (hasEarlyResult) {
    await finalizeStepResponses({ requestStepId });
  }

  return responseId;
};
