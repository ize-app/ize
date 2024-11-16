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

    const notEnoughResponses =
      reqStep.Step.ResponseConfig?.minResponses ?? 0 < reqStep.Responses.length;

    const earlyResults = await Promise.all(
      resultConfigs.map(async (r) => {
        if (notEnoughResponses) return false;
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

          if (r.ResultConfigDecision?.type === DecisionType.Ai) return true;

          const { optionId } = await determineDecision({
            resultConfig: r,
            answers: fieldAnswers,
            requestStepId,
          });

          return !!optionId;
        }
        return false;
      }),
    );

    // if there is an early result, return true
    const earlyResult = earlyResults.find((r) => r);

    return !!earlyResult;
  } catch (e) {
    console.log("Error checkIfEarlyResults: ", e);
    return false;
  }
};
