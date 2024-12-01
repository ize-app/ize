import { Prisma, ValueType } from "@prisma/client";

import { FieldPrismaType } from "@/core/fields/fieldPrismaTypes";
import { LlmSummaryArgs } from "@/graphql/generated/resolver-types";
import { ApolloServerErrorCode, GraphQLError } from "@graphql/errors";

export const newLlmSummaryConfig = async ({
  resultConfigId,
  llmArgs,
  responseField,
  transaction,
}: {
  resultConfigId: string;
  llmArgs: LlmSummaryArgs;
  responseField: FieldPrismaType;
  transaction: Prisma.TransactionClient;
}): Promise<string | null> => {
  if (responseField.type === ValueType.OptionSelections)
    throw new GraphQLError("Llm summary result cannot be for an options field.", {
      extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
    });

  const llmConfig = await transaction.resultConfigLlm.create({
    data: {
      resultConfigId,
      prompt: llmArgs.prompt,
      isList: llmArgs.isList,
    },
  });

  return llmConfig.id;
};
