import { Prisma } from "@prisma/client";

import { ActionArgs, ActionType } from "@/graphql/generated/resolver-types";
import { ApolloServerErrorCode, GraphQLError } from "@graphql/errors";

type PrismaTriggerStepActionConfigArgs = Omit<
  Prisma.ActionConfigTriggerStepUncheckedCreateInput,
  "actionConfigId"
>;

export const newTriggerStepAction = ({
  actionArgs,
  nextStepId,
}: {
  actionArgs: ActionArgs;
  nextStepId: string | null;
}): PrismaTriggerStepActionConfigArgs | undefined => {
  if (actionArgs.type !== ActionType.TriggerStep) return undefined;

  const stepId = actionArgs.stepId;

  if (!stepId)
    throw new GraphQLError(`Missing stepId for new trigger step action config`, {
      extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
    });

  if (stepId !== nextStepId)
    throw new GraphQLError(`Step Id of trigger step action does not match next step`, {
      extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
    });

  const dbWebhookArgs: PrismaTriggerStepActionConfigArgs = {
    stepId,
  };

  return dbWebhookArgs;
};
