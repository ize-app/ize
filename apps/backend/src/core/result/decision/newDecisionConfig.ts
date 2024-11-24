import { Prisma } from "@prisma/client";

import { FieldPrismaType } from "@/core/fields/fieldPrismaTypes";
import { DecisionArgs, DecisionType, FieldType } from "@/graphql/generated/resolver-types";
import { ApolloServerErrorCode, GraphQLError } from "@graphql/errors";

export const newDecisionConfig = async ({
  resultConfigId,
  decisionArgs,
  responseField,
  transaction,
}: {
  resultConfigId: string;
  decisionArgs: DecisionArgs;
  responseField: FieldPrismaType;
  transaction: Prisma.TransactionClient;
}): Promise<string | null> => {
  const defaultOptionId: null | string =
    decisionArgs.type !== DecisionType.Ai ? decisionArgs.defaultOptionId ?? null : null;
  let threshold: null | number = null;
  let criteria: null | string = null;

  // Doing these manual checks in case a decision config has settings that
  // aren't relevant to that decision type
  if (responseField.type !== FieldType.Options) {
    throw new GraphQLError("Option field required for decision result", {
      extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
    });
  }

  if (
    decisionArgs.type === DecisionType.NumberThreshold ||
    decisionArgs.type === DecisionType.PercentageThreshold
  ) {
    threshold = decisionArgs.threshold ?? null;
  }

  responseField.FieldOptionsConfig;
  if (defaultOptionId) {
    const validDefaultOptionId = (
      responseField.FieldOptionsConfig?.PredefinedOptionSet?.FieldOptions ?? []
    ).some((fo) => fo.id === defaultOptionId);

    if (!validDefaultOptionId)
      throw new GraphQLError("Cannot find default option.", {
        extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
      });
  }

  if (decisionArgs.type === DecisionType.Ai) {
    criteria = decisionArgs.criteria ?? null;
  }

  if (
    (decisionArgs.type === DecisionType.NumberThreshold ||
      decisionArgs.type === DecisionType.PercentageThreshold) &&
    !decisionArgs.threshold
  ) {
    throw new GraphQLError("Missing decision threshold", {
      extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
    });
  }

  const decisionConfig = await transaction.resultConfigDecision.create({
    data: {
      resultConfigId,
      type: decisionArgs.type,
      defaultOptionId,
      threshold,
      criteria,
    },
  });

  return decisionConfig.id;
};
