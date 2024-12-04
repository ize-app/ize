import { Prisma } from "@prisma/client";

import { ActionFilterArgs, FieldSetArgs, ResultArgs } from "@/graphql/generated/resolver-types";
import { ApolloServerErrorCode, GraphQLError } from "@graphql/errors";

type PrismaActionFilterArgs = Omit<Prisma.ActionConfigFilterUncheckedCreateInput, "actionConfigId">;

export const newActionFilter = ({
  actionFilterArgs,
  responseFieldSet,
  resultConfigs,
}: {
  actionFilterArgs: ActionFilterArgs | undefined | null;
  responseFieldSet: FieldSetArgs;
  resultConfigs: ResultArgs[];
}): PrismaActionFilterArgs | null => {
  if (!actionFilterArgs) return null;

  const { resultConfigId, optionId } = actionFilterArgs;

  const resultConfig = resultConfigs.find((rc) => rc.resultConfigId === resultConfigId);

  if (!resultConfig)
    throw new GraphQLError("Step does not have corresponding resultConfig for actionFilter", {
      extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
    });

  const responseField = (responseFieldSet?.fields ?? []).find(
    (f) => f.fieldId === resultConfig.fieldId,
  );

  const hasOptionId = (responseField?.optionsConfig?.options ?? []).some((option) => {
    return option.optionId === optionId;
  });

  if (!hasOptionId)
    throw new GraphQLError("Action filter option does not exist on field", {
      extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
    });

  const dbActionFilterArgs: PrismaActionFilterArgs = { optionId, resultConfigId };

  return dbActionFilterArgs;
};
