import { Prisma, ResultConfig } from "@prisma/client";

import { ResultArgs, ResultType } from "@/graphql/generated/resolver-types";
import { ApolloServerErrorCode, GraphQLError } from "@graphql/errors";

import { newDecisionConfig } from "./decision/newDecisionConfig";
import { newRankConfig } from "./decision/newRankConfig";
import { newLlmSummaryConfig } from "./llm/newLlmSummaryConfig";
import { checkRawAnswersConfig } from "./rawAnswers.ts/newRawAnswersConfig";
import { resultConfigInclude } from "./resultPrismaTypes";
import { FieldPrismaType, FieldSetPrismaType } from "../fields/fieldPrismaTypes";

export const newResultConfigSet = async ({
  resultsArgs,
  stepId,
  responseFieldSet,
  transaction,
}: {
  resultsArgs: ResultArgs[];
  stepId: string;
  responseFieldSet: FieldSetPrismaType | undefined | null;
  transaction: Prisma.TransactionClient;
}): Promise<ResultConfig[] | undefined> => {
  if (resultsArgs.length === 0) return undefined;

  const resultConfigSet = await transaction.resultConfigSet.create({
    data: {
      stepId,
    },
  });

  await Promise.all(
    resultsArgs.map(async (res, index) => {
      // responseFieldSet?.FieldSetFields.find((f) => f.fieldId === res.p)
      let responseField = null;

      responseField = (responseFieldSet?.Fields ?? []).find((f) => {
        return f.id === res.fieldId;
      });

      if (!responseField)
        throw new GraphQLError(`Missing response field for ${res.fieldId}`, {
          extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
        });

      const resultConfig = await transaction.resultConfig.create({
        data: {
          id: res.resultConfigId,
          resultConfigSetId: resultConfigSet.id,
          index,
          resultType: res.type,
          fieldId: responseField.id,
        },
      });

      return await newResultConfig({
        resultConfigId: resultConfig.id,
        resultArgs: res,
        responseField,
        transaction,
      });
    }),
  );

  return await transaction.resultConfig.findMany({
    where: { resultConfigSetId: resultConfigSet.id },
    include: resultConfigInclude,
  });
};

export const newResultConfig = async ({
  resultConfigId,
  resultArgs,
  responseField,
  transaction,
}: {
  resultConfigId: string;
  resultArgs: ResultArgs;
  responseField: FieldPrismaType;
  transaction: Prisma.TransactionClient;
}): Promise<void> => {
  switch (resultArgs.type) {
    case ResultType.Decision:
      if (!resultArgs.decision)
        throw new GraphQLError("Missing decision config.", {
          extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
        });
      await newDecisionConfig({
        resultConfigId,
        decisionArgs: resultArgs.decision,
        transaction,
        responseField,
      });
      break;
    case ResultType.Ranking:
      if (!resultArgs.prioritization)
        throw new GraphQLError("Missing prioritization config.", {
          extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
        });
      await newRankConfig({
        resultConfigId,
        rankArgs: resultArgs.prioritization,
        transaction,
        responseField,
      });
      break;
    case ResultType.LlmSummary:
      if (!resultArgs.llmSummary)
        throw new GraphQLError("Missing LLM Summary config", {
          extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
        });
      await newLlmSummaryConfig({
        resultConfigId,
        llmArgs: resultArgs.llmSummary,
        transaction,
        responseField,
      });
      break;
    case ResultType.RawAnswers:
      checkRawAnswersConfig({ responseField });
      break;
  }

  return;
};
