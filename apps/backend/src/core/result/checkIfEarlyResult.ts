import { DecisionType } from "@prisma/client";

import { ResultType } from "@/graphql/generated/resolver-types";
import { prisma } from "@/prisma/client";
import { ApolloServerErrorCode, GraphQLError } from "@graphql/errors";

import { determineDecision } from "./decision/determineDecision";
import { getFieldAnswersFromResponses } from "./utils/getFieldAnswersFromResponses";
import { stepInclude } from "../flow/flowPrismaTypes";
import { responseInclude } from "../response/responsePrismaTypes";

// see if there are any results yet which would end the request early
// so far, this only applies to decisions
export const checkIfEarlyResult = async ({
  requestStepId,
}: {
  requestStepId: string;
}): Promise<boolean> => {
  try {
    const reqStep = await prisma.requestStep.findFirstOrThrow({
      where: {
        id: requestStepId,
      },
      include: {
        Step: {
          include: stepInclude,
        },
        Responses: {
          include: responseInclude,
        },
      },
    });

    const resultConfigs =
      reqStep.Step.ResultConfigSet?.ResultConfigSetResultConfigs.map((r) => r.ResultConfig) ?? [];

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
          responses: reqStep.Responses,
        });

        if (r.minAnswers > fieldAnswers.length) return false;
        if (r.ResultConfigDecision?.type === DecisionType.Ai) return true;

        return !!determineDecision({ resultConfig: r, answers: fieldAnswers, requestStepId });
      }
      return false;
    });

    return !!earlyResult;
  } catch (e) {
    console.log("Error checkIfEarlyResults: ", e);
    return false;
  }
};
