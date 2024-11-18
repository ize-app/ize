import { Prisma } from "@prisma/client";

import { FieldPrismaType } from "@/core/fields/fieldPrismaTypes";
import { FieldType, LlmSummaryArgs } from "@/graphql/generated/resolver-types";
import { ApolloServerErrorCode, GraphQLError } from "@graphql/errors";

export const newLlmSummaryConfig = async ({
  llmArgs,
  responseField,
  transaction,
}: {
  llmArgs: LlmSummaryArgs;
  responseField: FieldPrismaType;
  transaction: Prisma.TransactionClient;
}): Promise<string | null> => {
  if (responseField.type !== FieldType.FreeInput)
    throw new GraphQLError("Free input field required for llm summary result.", {
      extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
    });

  const llmConfig = await transaction.resultConfigLlm.create({
    data: {
      prompt: llmArgs.prompt,
      isList: llmArgs.isList,
    },
  });

  return llmConfig.id;
};
