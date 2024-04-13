import { prisma } from "../../prisma/client";
import { MutationNewResponseArgs } from "@graphql/generated/resolver-types";

import { stepInclude } from "@/core/flow/flowPrismaTypes";
import { ApolloServerErrorCode, CustomErrorCodes, GraphQLError } from "@graphql/errors";
import { GraphqlRequestContext } from "../../graphql/context";
import { hasWritePermission } from "../permission/hasWritePermission";
import { newFieldAnswers } from "../fields/newFieldAnswers";
import { checkIfEarlyResult } from "../result/checkIfEarlyResult";
import { fieldAnswerInclude, fieldOptionSetInclude } from "../fields/fieldPrismaTypes";
import { responseInclude } from "./responsePrismaTypes";
import { runResultsAndActions } from "../result/newResults/runResultsAndActions";

// creates a new response for a given request step
// validates/creates field answers
export const newResponse = async ({
  args,
  context,
}: {
  args: MutationNewResponseArgs;
  context: GraphqlRequestContext;
}): Promise<string> => {
  args.response.answers;
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

    if (
      !hasWritePermission({ permission: requestStep.Step.RequestPermissions, context, transaction })
    )
      throw new GraphQLError("Unauthenticated", {
        extensions: { code: CustomErrorCodes.Unauthenticated },
      });

    if (!context.currentUser)
      throw new GraphQLError("Unauthenticated", {
        extensions: { code: CustomErrorCodes.Unauthenticated },
      });

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

    const response = await transaction.response.create({
      data: {
        creatorId: context.currentUser.id,
        requestStepId,
      },
    });

    await newFieldAnswers({
      fieldSet: requestStep.Step.ResponseFieldSet,
      fieldAnswers: answers,
      requestDefinedOptionSets: requestStep.RequestDefinedOptionSets,
      responseId: response.id,
      transaction,
    });

    if (checkIfEarlyResult({ step: requestStep.Step, responses: requestStep.Responses })) {
      await runResultsAndActions({
        requestStepId: requestStep.id,
        step: requestStep.Step,
        responses: requestStep.Responses,
      });
    }

    return response.id;
  });
};
