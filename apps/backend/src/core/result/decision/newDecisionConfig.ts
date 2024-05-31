import { Prisma } from "@prisma/client";

import { FieldPrismaType } from "@/core/fields/fieldPrismaTypes";
import { DecisionArgs, DecisionType, FieldType } from "@/graphql/generated/resolver-types";
import { ApolloServerErrorCode, GraphQLError } from "@graphql/errors";

export const newDecisionConfig = async ({
  decisionArgs,
  responseField,
  transaction,
}: {
  decisionArgs: DecisionArgs;
  responseField: FieldPrismaType;
  transaction: Prisma.TransactionClient;
}): Promise<string | null> => {
  let defaultOptionId: null | string = null;

  if (responseField.type !== FieldType.Options) {
    throw new GraphQLError("Option field required for decision result", {
      extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
    });
  }

  if (typeof decisionArgs.defaultOptionIndex === "number") {
    defaultOptionId =
      responseField.FieldOptionsConfigs?.FieldOptionSet.FieldOptionSetFieldOptions.find(
        (fo) => fo.index === decisionArgs.defaultOptionIndex,
      )?.fieldOptionId ?? null;

    if (defaultOptionId === null)
      throw new GraphQLError("Cannot find default option.", {
        extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
      });
  }

  if (decisionArgs.type !== DecisionType.WeightedAverage && !decisionArgs.threshold) {
    throw new GraphQLError("Missing decision threshold", {
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
