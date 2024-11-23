import { Prisma, ResultConfig } from "@prisma/client";

import { ResultArgs, ResultType } from "@/graphql/generated/resolver-types";
import { ApolloServerErrorCode, GraphQLError } from "@graphql/errors";

import { newDecisionConfig } from "./decision/newDecisionConfig";
import { newRankConfig } from "./decision/newRankConfig";
import { newLlmSummaryConfig } from "./llm/newLlmSummaryConfig";
import { checkRawAnswersConfig } from "./rawAnswers.ts/newRawAnswersConfig";
import { FieldPrismaType, FieldSetPrismaType } from "../fields/fieldPrismaTypes";

export const newResultConfigSet = async ({
  resultsArgs,
  responseFieldSet,
  transaction,
}: {
  resultsArgs: ResultArgs[];
  responseFieldSet: FieldSetPrismaType | undefined | null;
  transaction: Prisma.TransactionClient;
}): Promise<[string, ResultConfig[]] | undefined> => {
  if (resultsArgs.length === 0) return undefined;
  const resultConfigs = await Promise.all(
    resultsArgs.map(async (res) => {
      // responseFieldSet?.FieldSetFields.find((f) => f.fieldId === res.p)
      let responseField = null;
      
      responseField = (responseFieldSet?.FieldSetFields ?? []).find((f) => {
        return f.fieldId === res.fieldId;
      })?.Field;

      if (!responseField)
        throw new GraphQLError(`Missing response field for ${res.fieldId}`, {
          extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
        });

      return await newResultConfig({
        resultArgs: res,
        responseField,
        transaction,
      });
    }),
  );

  const fieldSet = await transaction.resultConfigSet.create({
    data: {
      ResultConfigSetResultConfigs: {
        createMany: {
          data: resultConfigs.map((resultConfig) => ({ resultConfigId: resultConfig.id })),
        },
      },
    },
  });

  return [fieldSet.id, resultConfigs];
};

export const newResultConfig = async ({
  resultArgs,
  responseField,
  transaction,
}: {
  resultArgs: ResultArgs;
  responseField: FieldPrismaType;
  transaction: Prisma.TransactionClient;
}): Promise<ResultConfig> => {
  let decisionId;
  let rankId;
  let llmId;

  switch (resultArgs.type) {
    case ResultType.Decision:
      if (!resultArgs.decision)
        throw new GraphQLError("Missing decision config.", {
          extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
        });
      decisionId = await newDecisionConfig({
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
      rankId = await newRankConfig({
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
      llmId = await newLlmSummaryConfig({
        llmArgs: resultArgs.llmSummary,
        transaction,
        responseField,
      });
      break;
    case ResultType.RawAnswers:
      checkRawAnswersConfig({ responseField });
      break;
  }

  return await transaction.resultConfig.create({
    data: {
      id: resultArgs.resultConfigId,
      resultType: resultArgs.type,
      fieldId: responseField.id,
      decisionId,
      rankId,
      llmId,
    },
  });
};
