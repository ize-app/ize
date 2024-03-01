import { FieldPrismaType } from "@/flow/fields/fieldPrismaTypes";
import { DecisionNewArgs, FieldType } from "@/graphql/generated/resolver-types";
import { Prisma } from "@prisma/client";
import { GraphQLError, ApolloServerErrorCode } from "@graphql/errors";

export const newDecisionConfig = async ({
  decisionArgs,
  responseField,
  transaction,
}: {
  decisionArgs: DecisionNewArgs;
  responseField: FieldPrismaType;
  transaction: Prisma.TransactionClient;
}): Promise<string | null> => {
  let defaultOptionId: null | string = null;

  if (responseField.type !== FieldType.Options) {
    throw new GraphQLError("Option field required for decision result", {
      extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
    });
  }

  if (decisionArgs.defaultOptionIndex) {
    defaultOptionId =
      responseField.FieldOptionsConfigs?.FieldOptionSet.FieldOptionSetFieldOptions.find(
        (fo) => fo.index === decisionArgs.defaultOptionIndex,
      )?.fieldOptionId ?? null;

    if (defaultOptionId === null)
      throw new GraphQLError("Cannot find default option.", {
        extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
      });
  }

  const decisionConfig = await transaction.resultConfigDecision.create({
    data: {
      type: decisionArgs.type,
      defaultOptionId,
      threshold: decisionArgs.threshold,
    },
  });

  return decisionConfig.id;
};
