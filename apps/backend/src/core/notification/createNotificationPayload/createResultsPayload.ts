import { Request, WebhookValue } from "@/graphql/generated/resolver-types";
import { ApolloServerErrorCode, GraphQLError } from "@graphql/errors";

export const createResultsPayload = (request: Request): WebhookValue[] => {
  const results: WebhookValue[] = [];

  request.requestSteps.map((step, stepIndex) => {
    (step.results ?? []).forEach((resultGroup) => {
      const resultConfig = request.flow.steps[stepIndex].result.find((r) => {
        return r.resultConfigId === resultGroup.resultConfigId;
      });
      if (!resultConfig)
        throw new GraphQLError(`Cannot find result config for result id: ${resultGroup.id}`, {
          extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
        });

      const field = request.flow.steps[stepIndex].fieldSet.fields.find((field) => {
        return field.fieldId === resultConfig.fieldId;
      });
      if (!field)
        throw new GraphQLError(
          `Cannot find field for result config Id ${resultConfig.resultConfigId}`,
          {
            extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
          },
        );

      // TODO: change result output type for when there are multiple results in a result group
      const result = resultGroup.results[0];

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

  return results;
};
