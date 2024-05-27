import { Prisma } from "@prisma/client";

import { ResultArgs, ResultType } from "@/graphql/generated/resolver-types";
import { ApolloServerErrorCode, GraphQLError } from "@graphql/errors";

import { newDecisionConfig } from "./decision/newDecisionConfig";
import { newLlmSummaryConfig } from "./decision/newLlmSummaryConfig";
import { newRankConfig } from "./decision/newRankConfig";
import { FieldPrismaType, FieldSetPrismaType } from "../fields/fieldPrismaTypes";

export const newResultConfigSet = async ({
  resultsArgs,
  responseFieldSet,
  transaction,
}: {
  resultsArgs: ResultArgs[];
  responseFieldSet: FieldSetPrismaType | undefined | null;
  transaction: Prisma.TransactionClient;
}): Promise<string | undefined> => {
  if (resultsArgs.length === 0) return undefined;
  const dbResults = await Promise.all(
    resultsArgs.map(async (res) => {
      // responseFieldSet?.FieldSetFields.find((f) => f.fieldId === res.p)
      let responseField = null;
      if (typeof res.responseFieldIndex === "number")
        responseField = responseFieldSet?.FieldSetFields[res.responseFieldIndex].Field;

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
          data: dbResults.map((resultConfigId) => ({ resultConfigId: resultConfigId })),
        },
      },
    },
  });

  return fieldSet.id;
};

export const newResultConfig = async ({
  resultArgs,
  responseField,
  transaction,
}: {
  resultArgs: ResultArgs;
  responseField: FieldPrismaType | undefined | null;
  transaction: Prisma.TransactionClient;
}): Promise<string> => {
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
        responseField: responseField as FieldPrismaType,
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
        responseField: responseField as FieldPrismaType,
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
        responseField: responseField as FieldPrismaType,
      });
      break;
    case ResultType.LlmSummaryList:
      if (!resultArgs.llmSummary)
        throw new GraphQLError("Missing LLM Summary config", {
          extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
        });
      llmId = await newLlmSummaryConfig({
        llmArgs: resultArgs.llmSummary,
        transaction,
        responseField: responseField as FieldPrismaType,
      });
      break;
  }

  const resultConfig = await transaction.resultConfig.create({
    data: {
      resultType: resultArgs.type as ResultType,
      minAnswers: resultArgs.minimumAnswers ?? undefined,
      fieldId: responseField?.id,
      decisionId,
      rankId,
      llmId,
    },
  });
  return resultConfig.id;
};
