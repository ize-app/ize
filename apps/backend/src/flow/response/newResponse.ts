import { prisma } from "../../prisma/client";
import { MutationNewResponseArgs } from "@graphql/generated/resolver-types";

import { stepInclude } from "@/flow/flow/flowPrismaTypes";
import { ApolloServerErrorCode, CustomErrorCodes, GraphQLError } from "@graphql/errors";
import { GraphqlRequestContext } from "../../graphql/context";
import { hasWritePermission } from "../permission/hasWritePermission";
import { newFieldAnswers } from "../fields/newFieldAnswers";
import { requestStepInclude } from "../request/requestTypes";

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
      include: requestStepInclude,
    });

    requestStep.stepId;

    const step = await transaction.step.findUniqueOrThrow({
      where: {
        id: requestStep.requestId,
      },
      include: stepInclude,
    });

    if (!hasWritePermission({ permission: step.RequestPermissions, context, transaction }))
      throw new GraphQLError("Unauthenticated", {
        extensions: { code: CustomErrorCodes.Unauthenticated },
      });

    if (!context.currentUser)
      throw new GraphQLError("Unauthenticated", {
        extensions: { code: CustomErrorCodes.Unauthenticated },
      });

    const existingUserResponse = await transaction.responseNew.findFirst({
      where: { creatorId: context.currentUser.id },
    });

    if (existingUserResponse)
      throw new GraphQLError(
        `Response already exists for this request step. requestStepId: ${requestStepId}, userId: ${context.currentUser.id}`,
        {
          extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
        },
      );

    await newFieldAnswers({
      fieldSet: step.ResponseFieldSet,
      fieldAnswers: answers,
      transaction,
    });

    const response = await transaction.responseNew.create({
      data: {
        creatorId: context.currentUser.id,
        requestStepId,
      },
    });

    return response.id;
  });
};
