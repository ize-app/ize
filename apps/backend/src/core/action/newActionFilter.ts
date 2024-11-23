import { Prisma, ResultConfig } from "@prisma/client";

import { ActionFilterArgs } from "@/graphql/generated/resolver-types";
import { ApolloServerErrorCode, GraphQLError } from "@graphql/errors";

import { FieldSetPrismaType } from "../fields/fieldPrismaTypes";

export const newActionFilter = async ({
  actionFilterArgs,
  responseFieldSet,
  resultConfigs,
  transaction,
}: {
  actionFilterArgs: ActionFilterArgs | undefined | null;
  responseFieldSet: FieldSetPrismaType | undefined | null;
  resultConfigs: ResultConfig[];
  transaction: Prisma.TransactionClient;
}): Promise<string | null> => {
  if (!actionFilterArgs) return null;

  const { resultConfigId, optionId } = actionFilterArgs;

  const resultConfig = resultConfigs.find((rc) => rc.id === resultConfigId);

  if (!resultConfig)
    throw new GraphQLError("Step does not have corresponding resultConfig for actionFilter", {
      extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
    });

  const responseField = responseFieldSet?.FieldSetFields.find(
    (f) => f.fieldId === resultConfig.fieldId,
  );

  const hasOptionId = (
    responseField?.Field.FieldOptionsConfigs?.FieldOptionSet.FieldOptionSetFieldOptions ?? []
  ).some((option) => {
    return option.fieldOptionId === optionId;
  });

  if (!hasOptionId)
    throw new GraphQLError("Action filter option does not exist on field", {
      extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
    });

  const action = await transaction.actionFilter.create({
    data: {
      optionId,
      resultConfigId,
    },
  });

  return action.id;
};
