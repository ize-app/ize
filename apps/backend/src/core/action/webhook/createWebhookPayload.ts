import { Prisma } from "@prisma/client";

import { requestInclude } from "@/core/request/requestPrismaTypes";
import { requestResolver } from "@/core/request/resolvers/requestResolver";
import { FieldType, WebhookPayload, WebhookValue } from "@/graphql/generated/resolver-types";
import { ApolloServerErrorCode, GraphQLError } from "@graphql/errors";

import { prisma } from "../../../prisma/client";

export const createWebhookPayload = async ({
  requestStepId,
  transaction = prisma,
}: {
  requestStepId: string;

  transaction?: Prisma.TransactionClient;
}): Promise<WebhookPayload> => {
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
  const formattedRequest = requestResolver({
    req: reqStep.Request,
    context: { currentUser: null, discordApi: undefined },
    userGroupIds: [],
  });

  const requestFields: WebhookValue[] = formattedRequest.flow.steps[0].request.fields.map(
    (field) => {
      const answer = formattedRequest.steps[0].requestFieldAnswers.find(
        (fa) => fa.fieldId === field.fieldId,
      );
      if (!answer) throw Error("");
      if (field.__typename === FieldType.FreeInput) {
        if (answer.__typename !== "FreeInputFieldAnswer")
          throw new GraphQLError(
            `Free input field ${field.fieldId} has field answer that is not free input answer`,
            {
              extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
            },
          );
        return {
          fieldName: field.name,
          value: answer.value,
        };
      } else if (field.__typename === FieldType.Options) {
        if (answer.__typename !== "OptionFieldAnswer")
          throw new GraphQLError(
            `Options field ${field.fieldId} has field answer that is not options answer`,
            {
              extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
            },
          );
        return {
          fieldName: field.name,
          optionSelections: answer.selections.map((s) => {
            const option = field.options.find((o) => {
              if (o.optionId === s.optionId) return o.name;
            });
            if (!option) throw Error("");
            return option.name;
          }),
        };
      } else
        throw new GraphQLError(`Unknown field type. field ID: ${field.fieldId}`, {
          extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
        });
    },
  );

  const results: WebhookValue[] = [];

  formattedRequest.steps.map((step, stepIndex) => {
    step.results.forEach((result) => {
      const resultConfig = formattedRequest.flow.steps[stepIndex].result.find((r) => {
        return r.resultConfigId === result.resultConfigId;
      });
      if (!resultConfig)
        throw new GraphQLError(`Cannot find result config for result id: ${result.id}`, {
          extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
        });

      const field = formattedRequest.flow.steps[stepIndex].response.fields.find((field) => {
        return field.fieldId === resultConfig.fieldId;
      });
      if (!field)
        throw new GraphQLError(
          `Cannot find field for result config Id ${resultConfig.resultConfigId}`,
          {
            extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
          },
        );

      if (result.resultItems.length === 1) {
        results.push({
          fieldName: field.name,
          value: result.resultItems[0].value,
        });
      } else {
        results.push({
          fieldName: field.name,
          optionSelections: result.resultItems.map((item) => item.value),
        });
      }
    });
  });

  return {
    createdAt: formattedRequest.createdAt,
    flowName: formattedRequest.flow.name,
    requestName: formattedRequest.name,
    requestFields,
    results,
  };
};
