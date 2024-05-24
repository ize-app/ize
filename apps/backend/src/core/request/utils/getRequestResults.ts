import { GenericFieldAndValue, Request } from "@/graphql/generated/resolver-types";
import { GraphQLError, ApolloServerErrorCode } from "@graphql/errors";

export const getRequestResults = ({ request }: { request: Request }): GenericFieldAndValue[] => {
  const results: GenericFieldAndValue[] = [];

  request.steps.map((step, stepIndex) => {
    step.results.forEach((result) => {
      const resultConfig = request.flow.steps[stepIndex].result.find((r) => {
        return r.resultConfigId === result.resultConfigId;
      });
      if (!resultConfig)
        throw new GraphQLError(`Cannot find result config for result id: ${result.id}`, {
          extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
        });

      const field = request.flow.steps[stepIndex].response.fields.find((field) => {
        return field.fieldId === resultConfig.fieldId;
      });
      if (!field)
        throw new GraphQLError(
          `Cannot find field for result config Id ${resultConfig.resultConfigId}`,
          {
            extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
          },
        );

      results.push({
        fieldName: field.name,
        value: result.resultItems.map((item) => item.value),
      });
    });
  });

  return results;
};
