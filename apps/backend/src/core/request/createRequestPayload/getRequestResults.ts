import { GenericFieldAndValue, Request } from "@/graphql/generated/resolver-types";
import { ApolloServerErrorCode, GraphQLError } from "@graphql/errors";

export interface RequestResultGroup {
  fieldName: string;
  result: GenericFieldAndValue[];
}

export const getRequestResultGroups = ({
  request,
  limitToRequestStepId,
}: {
  request: Request;
  limitToRequestStepId?: string | undefined;
}): RequestResultGroup[] => {
  const requestResults: RequestResultGroup[] = [];

  request.requestSteps.forEach((requestStep, stepIndex) => {
    if (limitToRequestStepId && requestStep.requestStepId !== limitToRequestStepId) return;

    requestStep.results.forEach((resultGroup) => {
      const resultConfig = request.flow.steps[stepIndex].result.find((r) => {
        return r.resultConfigId === resultGroup.resultConfigId;
      });

      if (!resultConfig)
        throw new GraphQLError(`Cannot find result config for resultGroup id: ${resultGroup.id}`, {
          extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
        });

      const requestResult: RequestResultGroup = {
        fieldName: resultConfig.field.name,
        result: resultGroup.results.map((result) => {
          return {
            fieldName: `${resultConfig.field.name} (${resultConfig.name})`,
            value: result.resultItems.map((item) => item.value),
          };
        }),
      };
      requestResults.push(requestResult);
    });
  });
  return requestResults;
};
