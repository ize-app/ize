import { stepInclude } from "@/core/flow/flowPrismaTypes";
import { ApolloServerErrorCode, CustomErrorCodes, GraphQLError } from "@graphql/errors";
import { MutationNewResponseArgs } from "@graphql/generated/resolver-types";

import { responseInclude } from "./responsePrismaTypes";
import { GraphqlRequestContext } from "../../graphql/context";
import { prisma } from "../../prisma/client";
import { fieldAnswerInclude, fieldOptionSetInclude } from "../fields/fieldPrismaTypes";
import { newFieldAnswers } from "../fields/newFieldAnswers";
import { hasWritePermission } from "../permission/hasWritePermission";
import { checkIfEarlyResult } from "../result/checkIfEarlyResult";
import { runResultsAndActions } from "../result/newResults/runResultsAndActions";
import { watchFlow } from "../user/watchFlow";

// creates a new response for a given request step
// validates/creates field answers
export const newResponse = async ({
  args,
  context,
}: {
  args: MutationNewResponseArgs;
  context: GraphqlRequestContext;
}): Promise<string> => {
  const {
    response: { answers, requestStepId },
  } = args;

  return await prisma.$transaction(async (transaction) => {
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
          },
        },
        Responses: {
          include: responseInclude,
        },
        RequestFieldAnswers: {
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
    });

    const hasRespondPermissions = await hasWritePermission({
      permission: requestStep.Step.ResponsePermissions,
      context,
      transaction,
    });

    if (!hasRespondPermissions) {
      throw new GraphQLError("Unauthenticated", {
        extensions: { code: CustomErrorCodes.Unauthenticated },
      });
    }

    if (!context.currentUser)
      throw new GraphQLError("Unauthenticated", {
        extensions: { code: CustomErrorCodes.Unauthenticated },
      });

    if (requestStep.id !== requestStep.Request.currentRequestStepId)
      throw new GraphQLError(
        "User is trying to submit response for request step that is not the current request step.",
        {
          extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
        },
      );

    if (requestStep.responseComplete || requestStep.final || requestStep.Request.final)
      throw new GraphQLError(
        "Response received for reqeust step that is no longer accepting responses",
        {
          extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
        },
      );

    if (!requestStep.Step.allowMultipleResponses) {
      const existingUserResponse = await transaction.response.findFirst({
        where: { creatorId: context.currentUser.id, requestStepId },
      });

      if (existingUserResponse)
        throw new GraphQLError(
          `Response already exists for this request step. requestStepId: ${requestStepId}, userId: ${context.currentUser.id}`,
          {
            extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
          },
        );
    }

    const newResponse = await transaction.response.create({
      data: {
        creatorId: context.currentUser.id,
        requestStepId,
      },
    });

    await newFieldAnswers({
      fieldSet: requestStep.Step.ResponseFieldSet,
      fieldAnswers: answers,
      requestDefinedOptionSets: requestStep.RequestDefinedOptionSets,
      responseId: newResponse.id,
      transaction,
    });

    const allResponses = await transaction.response.findMany({
      include: responseInclude,
      where: {
        requestStepId,
      },
    });

    await watchFlow({
      flowId: requestStep.Request.FlowVersion.flowId,
      watch: true,
      userId: context.currentUser.id,
      transaction,
    });

    if (checkIfEarlyResult({ step: requestStep.Step, responses: allResponses })) {
      // not running results and actions on the same transaction so that vote can be recorded if there is issue with action / result
      // there is cron job to rerun stalled actions / results
      await runResultsAndActions({
        requestStepId: requestStep.id,
        step: requestStep.Step,
        responses: allResponses,
      });
    }

    return newResponse.id;
  });
};
