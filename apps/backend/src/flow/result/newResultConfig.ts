import { ResultArgs, ResultType } from "@/graphql/generated/resolver-types";
import { Prisma } from "@prisma/client";
import { FieldPrismaType } from "../fields/types";
import { newDecisionConfig } from "./decision/newDecisionConfig";
import { newRankConfig } from "./decision/newRankConfig";
import { newLlmSummaryConfig } from "./decision/newLlmSummaryConfig";
import { GraphQLError, ApolloServerErrorCode } from "@graphql/errors";

export const newResultConfig = async ({
  resultArgs,
  responseField,
  transaction,
}: {
  resultArgs: ResultArgs;
  responseField: FieldPrismaType | undefined;
  transaction: Prisma.TransactionClient;
}): Promise<string> => {
  let decisionId;
  let rankId;
  let llmId;

  if (resultArgs.type !== ResultType.AutoApprove && !responseField)
    throw Error("newResultConfig: Missing field ");

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
  }

  const resultConfig = await transaction.resultConfig.create({
    data: {
      resultType: resultArgs.type,
      minAnswers: resultArgs.minimumResponses ?? undefined,
      requestExpirationSeconds: resultArgs.requestExpirationSeconds ?? undefined,
      fieldId: responseField?.id,
      decisionId,
      rankId,
      llmId,
    },
  });
  return resultConfig.id;
};
