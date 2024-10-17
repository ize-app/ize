import { requestInclude } from "@/core/request/requestPrismaTypes";
import { requestResolver } from "@/core/request/resolvers/requestResolver";
import { Field, UserFieldAnswers } from "@/graphql/generated/resolver-types";
import { prisma } from "@/prisma/client";
import { ApolloServerErrorCode, GraphQLError } from "@graphql/errors";

import { getRequestResults } from "./getRequestResults";
import { getRequestTriggerFieldAnswers } from "./getRequestTriggerFieldAnswers";

// export function createPromptContext(params: { requestStepId: string; fieldId: string }): Promise<{
//   requestName: string;
//   flowName: string;
//   requestTriggerAnswers: ReturnType<typeof getRequestTriggerFieldAnswers>;
//   requestResults: ReturnType<typeof getRequestResults>;
//   field: Field;
// }>;

// export function createPromptContext(params: {
//   requestStepId: string;
//   fieldId?: undefined;
// }): Promise<{
//   requestName: string;
//   flowName: string;
//   requestTriggerAnswers: ReturnType<typeof getRequestTriggerFieldAnswers>;
//   requestResults: ReturnType<typeof getRequestResults>;
//   field?: undefined;
// }>;

// Implement the function
export async function createRequestPayload({
  requestStepId,
  fieldId,
}: {
  requestStepId: string;
  fieldId?: string | undefined;
}): Promise<{
  requestName: string;
  flowName: string;
  requestTriggerAnswers: ReturnType<typeof getRequestTriggerFieldAnswers>;
  requestResults: ReturnType<typeof getRequestResults>;
  fieldAnswers: UserFieldAnswers[];
  field?: Field | undefined; // General return type that covers both overloads
}> {
  const reqStep = await prisma.requestStep.findUniqueOrThrow({
    include: {
      Request: {
        include: requestInclude,
      },
    },
    where: {
      id: requestStepId,
    },
  });

  const request = await requestResolver({
    req: reqStep.Request,
    context: { currentUser: null, discordApi: undefined },
    userGroupIds: [],
  });

  let field: Field | undefined = undefined;

  const fieldAnswers: UserFieldAnswers[] = [];
  request.steps.forEach((step) => {
    step.responseFieldAnswers.forEach((responseFieldAnswer) => {
      if (fieldAnswers.length > 0) fieldAnswers.push(responseFieldAnswer);
    });
  });

  if (fieldId) {
    request.steps.forEach((step) => {
      step.responseFields.forEach((f) => {
        if (f.fieldId === fieldId) field = f;
      });
    });

    if (!field)
      throw new GraphQLError(
        `Can't find field for: ${fieldId} and requestId ${request.requestId}`,
        {
          extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
        },
      );
  }

  const requestName = request.name;
  const flowName = request.flow.name;
  const requestTriggerAnswers = getRequestTriggerFieldAnswers({ request });
  const requestResults = getRequestResults({ request });

  return { requestName, flowName, requestTriggerAnswers, requestResults, field, fieldAnswers };
}
