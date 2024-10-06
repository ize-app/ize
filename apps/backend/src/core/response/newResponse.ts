import { Response } from "@prisma/client";

import { stepInclude } from "@/core/flow/flowPrismaTypes";
import { ApolloServerErrorCode, CustomErrorCodes, GraphQLError } from "@graphql/errors";
import { MutationNewResponseArgs } from "@graphql/generated/resolver-types";

import { GraphqlRequestContext } from "../../graphql/context";
import { prisma } from "../../prisma/client";
import { IdentityPrismaType } from "../entity/identity/identityPrismaTypes";
import { fieldAnswerInclude, fieldOptionSetInclude } from "../fields/fieldPrismaTypes";
import { newFieldAnswers } from "../fields/newFieldAnswers";
import {
  hasWriteIdentityPermission,
  hasWriteUserPermission,
} from "../permission/hasWritePermission";
import { checkIfEarlyResult } from "../result/checkIfEarlyResult";
import { runResultsAndActions } from "../result/newResults/runResultsAndActions";
import { watchFlow } from "../user/watchFlow";

interface NewUserResponseProps {
  type: "user";
  args: MutationNewResponseArgs;
  context: GraphqlRequestContext;
}

interface NewIdentityResponseProps {
  type: "identity";
  args: MutationNewResponseArgs;
  identity: IdentityPrismaType;
}

type NewResponseProps = NewUserResponseProps | NewIdentityResponseProps;

// creates a new response for a given request step
// validates/creates field answers
export const newResponse = async ({ type, args, ...rest }: NewResponseProps): Promise<string> => {
  const {
    response: { answers, requestStepId },
  } = args;

  let hasRespondPermissions = false;
  let existingUserResponse: Response | null = null;
  let newResponse: Response;

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
          },
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

    if (type === "user") {
      const { context } = rest as NewUserResponseProps;
      // Use args and context here

      if (!context?.currentUser)
        throw new GraphQLError("Unauthenticated", {
          extensions: { code: CustomErrorCodes.Unauthenticated },
        });

      hasRespondPermissions = await hasWriteUserPermission({
        permission: requestStep.Step.ResponsePermissions,
        context,
        transaction,
      });

      existingUserResponse = await transaction.response.findFirst({
        where: {
          requestStepId,
          OR: [
            { userId: context.currentUser.id },
            {
              Identity: { User: { id: context.currentUser.id } },
            },
          ],
        },
      });

      newResponse = await transaction.response.create({
        data: {
          userId: context.currentUser.id,
          requestStepId,
        },
      });

      await watchFlow({
        flowId: requestStep.Request.FlowVersion.flowId,
        watch: true,
        userId: context.currentUser.id,
        transaction,
      });
    } else if (type === "identity") {
      const { identity } = rest as NewIdentityResponseProps;

      hasRespondPermissions = await hasWriteIdentityPermission({
        permission: requestStep.Step.ResponsePermissions,
        identity,
        transaction,
      });

      existingUserResponse = await transaction.response.findFirst({
        where: {
          requestStepId,
          OR: [
            { identityId: identity.id },
            { User: { Identities: { some: { id: { equals: identity.id } } } } },
          ],
        },
      });

      newResponse = await transaction.response.create({
        data: {
          identityId: identity.id,
          requestStepId,
        },
      });
    }

    if (!hasRespondPermissions) {
      throw new GraphQLError("User does not have permission to respond", {
        extensions: { code: CustomErrorCodes.InsufficientPermissions },
      });
    }

    if (!requestStep.Step.allowMultipleResponses) {
      if (existingUserResponse)
        throw new GraphQLError(
          `Response already exists for this request step. requestStepId: ${requestStepId}`,
          {
            extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
          },
        );
    }

    await newFieldAnswers({
      fieldSet: requestStep.Step.ResponseFieldSet,
      fieldAnswers: answers,
      requestDefinedOptionSets: requestStep.RequestDefinedOptionSets,
      responseId: newResponse.id,
      transaction,
    });

    return newResponse.id;
  });

  if (await checkIfEarlyResult({ requestStepId })) {
    // not running results and actions on the same transaction so that vote can be recorded if there is issue with action / result
    // there is cron job to rerun stalled actions / results
    await runResultsAndActions({
      requestStepId,
    });
  }

  return responseId;
};
