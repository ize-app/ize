import { FieldPrismaType } from "@/core/fields/fieldPrismaTypes";
import { FieldType, PrioritizationArgs } from "@/graphql/generated/resolver-types";
import { Prisma } from "@prisma/client";
import { GraphQLError, ApolloServerErrorCode } from "@graphql/errors";

export const newRankConfig = async ({
  rankArgs,
  responseField,
  transaction,
}: {
  rankArgs: PrioritizationArgs;
  responseField: FieldPrismaType;
  transaction: Prisma.TransactionClient;
}): Promise<string | null> => {
  if (responseField.type !== FieldType.Options)
    throw new GraphQLError("Option field rquired for ranking result", {
      extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
    });

  const rankConfig = await transaction.resultConfigRank.create({
    data: {
      numOptionsToInclude: rankArgs.numPrioritizedItems,
    },
  });

  return rankConfig.id;
};
