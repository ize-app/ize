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
import { getUserEntityIds } from "../user/getUserEntityIds";
import { UserPrismaType } from "../user/userPrismaTypes";
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

  // entityId that will be associated with this response
  let entityId: string;
  let user: UserPrismaType | undefined;
  // all entityIds that are associated together as belonging to a single user
  let entityIds: string[];
  let hasRespondPermissions = false;

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

    if (requestStep.responseFinal || requestStep.final || requestStep.Request.final)
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

      user = context.currentUser;
      entityId = context.currentUser.entityId;
      entityIds = getUserEntityIds(context.currentUser);

      hasRespondPermissions = await hasWriteUserPermission({
        permission: requestStep.Step.ResponsePermissions,
        context,
        transaction,
      });
    } else if (type === "identity") {
      const { identity } = rest as NewIdentityResponseProps;

      entityId = identity.entityId;
      entityIds = [entityId];

      hasRespondPermissions = await hasWriteIdentityPermission({
        permission: requestStep.Step.ResponsePermissions,
        identity,
        transaction,
      });
    }

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

    if (!requestStep.Step.allowMultipleResponses) {
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
        creatorEntityId: entityId,
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

    await watchFlow({
      flowId: requestStep.Request.FlowVersion.flowId,
      watch: true,
      entityId,
      transaction,
      user,
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
