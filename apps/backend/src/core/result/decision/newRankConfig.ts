import { Prisma } from "@prisma/client";

import { FieldPrismaType } from "@/core/fields/fieldPrismaTypes";
import { PrioritizationArgs, ValueType } from "@/graphql/generated/resolver-types";
import { ApolloServerErrorCode, GraphQLError } from "@graphql/errors";

export const newRankConfig = async ({
  resultConfigId,
  rankArgs,
  responseField,
  transaction,
}: {
  resultConfigId: string;
  rankArgs: PrioritizationArgs;
  responseField: FieldPrismaType;
  transaction: Prisma.TransactionClient;
}): Promise<string | null> => {
  if (responseField.type !== ValueType.OptionSelections)
    throw new GraphQLError("Option field rquired for ranking result", {
      extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
    });

  const rankConfig = await transaction.resultConfigRank.create({
    data: {
      resultConfigId,
      numOptionsToInclude: rankArgs.numPrioritizedItems,
    },
  });

  return rankConfig.id;
};
