import { Prisma, ResultConfig } from "@prisma/client";

import { ActionFilterArgs } from "@/graphql/generated/resolver-types";
import { ApolloServerErrorCode, GraphQLError } from "@graphql/errors";

import { FieldSetPrismaType } from "../fields/fieldPrismaTypes";

type PrismaActionFilterArgs = Omit<Prisma.ActionConfigFilterUncheckedCreateInput, "actionConfigId">;

export const newActionFilter = ({
  actionFilterArgs,
  responseFieldSet,
  resultConfigs,
}: {
  actionFilterArgs: ActionFilterArgs | undefined | null;
  responseFieldSet: FieldSetPrismaType | undefined | null;
  resultConfigs: ResultConfig[];
}): PrismaActionFilterArgs | null => {
  if (!actionFilterArgs) return null;

  const { resultConfigId, optionId } = actionFilterArgs;

  const resultConfig = resultConfigs.find((rc) => rc.id === resultConfigId);

  if (!resultConfig)
    throw new GraphQLError("Step does not have corresponding resultConfig for actionFilter", {
      extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
    });

  const responseField = (responseFieldSet?.Fields ?? []).find((f) => f.id === resultConfig.fieldId);

  const hasOptionId = (responseField?.FieldOptionsConfigs?.FieldOptionSet.FieldOptions ?? []).some(
    (option) => {
      return option.id === optionId;
    },
  );

  if (!hasOptionId)
    throw new GraphQLError("Action filter option does not exist on field", {
      extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
    });

  const dbActionFilterArgs: PrismaActionFilterArgs = { optionId, resultConfigId };

  return dbActionFilterArgs;
};
