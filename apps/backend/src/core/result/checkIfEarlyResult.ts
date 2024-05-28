import { ResponsePrismaType } from "@/core/response/responsePrismaTypes";
import { ResultType } from "@/graphql/generated/resolver-types";
import { ApolloServerErrorCode, GraphQLError } from "@graphql/errors";

import { determineDecision } from "./decision/determineDecision";
import { getFieldAnswersFromResponses } from "./utils/getFieldAnswersFromResponses";
import { StepPrismaType } from "../flow/flowPrismaTypes";

// see if there are any results yet which would end the request early
// so far, this only applies to decisions
export const checkIfEarlyResult = ({
  step,
  responses,
}: {
  step: StepPrismaType;
  responses: ResponsePrismaType[];
}): boolean => {
  try {
    const resultConfigs =
      step.ResultConfigSet?.ResultConfigSetResultConfigs.map((r) => r.ResultConfig) ?? [];

    const earlyResult = resultConfigs.find((r) => {
      if (r.resultType === ResultType.Decision) {
        const decisionConfig = r.ResultConfigDecision;
        if (!decisionConfig)
          throw new GraphQLError(
            `Missing decision config for resutl config. resultConfigId: ${r.id}`,
            {
              extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
            },
          );

        if (!r.fieldId)
          throw new GraphQLError(
            `Result config for decision is missing a fieldId: resultConfigId: ${r.id}`,
            {
              extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
            },
          );

        const fieldAnswers = getFieldAnswersFromResponses({
          fieldId: r.fieldId,
          responses,
        });

        return !!determineDecision({ decisionConfig, answers: fieldAnswers });
      }
      return false;
    });

    return !!earlyResult;
  } catch (e) {
    console.log("Error checkIfEarlyResults: ", e);
    return false;
  }
};
