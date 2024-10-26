import { Prisma } from "@prisma/client";

import { requestInclude } from "@/core/request/requestPrismaTypes";
import { requestResolver } from "@/core/request/resolvers/requestResolver";
import { Field, ResponseFieldAnswers } from "@/graphql/generated/resolver-types";
import { prisma } from "@/prisma/client";
import { ApolloServerErrorCode, GraphQLError } from "@graphql/errors";

import { createRequestUrl } from "./createRequestUrl";
import { getRequestResultGroups } from "./getRequestResults";
import { getRequestTriggerFieldAnswers } from "./getRequestTriggerFieldAnswers";

export interface RequestPayload {
  requestName: string;
  flowName: string;
  requestTriggerAnswers: ReturnType<typeof getRequestTriggerFieldAnswers>;
  results: ReturnType<typeof getRequestResultGroups>;
  requestUrl: string;
  fieldAnswers?: ResponseFieldAnswers[];
  field?: Field | undefined; // General return type that covers both overloads
}

// Purpose of this function is to simplify output of request data so it can be output to other tools and stringified
export async function createRequestPayload({
  requestStepId,
  fieldId,
  transaction = prisma,
}: {
  requestStepId: string;
  fieldId?: string | undefined;
  transaction?: Prisma.TransactionClient;
}): Promise<RequestPayload> {
  const reqStep = await transaction.requestStep.findUniqueOrThrow({
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

  const fieldAnswers: ResponseFieldAnswers[] = [];
  request.requestSteps.forEach((step) => {
    step.responseFieldAnswers.forEach((responseFieldAnswer) => {
      fieldAnswers.push(responseFieldAnswer);
    });
  });

  if (fieldId) {
    request.requestSteps.forEach((step) => {
      step.fieldSet.fields.forEach((f) => {
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
  const results = getRequestResultGroups({ request });
  const requestUrl = createRequestUrl({ requestId: request.requestId });

  return { requestName, flowName, requestTriggerAnswers, results, field, fieldAnswers, requestUrl };
}
