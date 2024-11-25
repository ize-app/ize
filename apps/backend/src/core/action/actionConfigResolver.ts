import { ActionType, FieldType } from "@prisma/client";

import {
  Action,
  ActionFilter,
  Field,
  Group,
  Option,
  ResultConfig,
} from "@/graphql/generated/resolver-types";
import { ApolloServerErrorCode, GraphQLError } from "@graphql/errors";

import { ActionConfigPrismaType } from "./actionPrismaTypes";
import { getActionName } from "./getActionName";
import { callWebhookResolver } from "./webhook/webhookResolver";

export const actionConfigResolver = ({
  actionConfig,
  responseFields,
  ownerGroup,
  resultConfigs,
}: {
  actionConfig: ActionConfigPrismaType | null | undefined;
  responseFields: Field[] | undefined;
  resultConfigs: ResultConfig[];
  ownerGroup: Group | null;
}): Action | null => {
  if (!actionConfig) return null;
  let filter: ActionFilter | undefined = undefined;

  const actionFilter = actionConfig.ActionConfigFilter;
  if (actionFilter) {
    const resultConfig = resultConfigs.find(
      (rc) => rc.resultConfigId === actionFilter.resultConfigId,
    );
    if (!resultConfig)
      throw new GraphQLError(`Cannot find resultConfig for action filter id ${actionFilter.id}`, {
        extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
      });

    const resultName = resultConfig.name;
    const resultConfigId = resultConfig.resultConfigId;
    const responseField = (responseFields ?? []).find(
      (field) => field.fieldId === resultConfig.field.fieldId,
    );
    let option: Option | undefined;

    if (responseField && responseField.__typename === FieldType.Options) {
      option = responseField.options.find((option) => option.optionId === actionFilter.optionId);
    }

    if (!option)
      throw new GraphQLError(`Cannot find option for action filter id ${actionFilter.id}`, {
        extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
      });

    filter = { resultConfigId, resultName, option };
  }

  const name = getActionName({ action: actionConfig, ownerGroup });

  switch (actionConfig.type) {
    case ActionType.CallWebhook:
      if (!actionConfig.ActionConfigWebhook)
        throw new GraphQLError("Missing webhook action config.", {
          extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
        });
      return callWebhookResolver({
        webhook: actionConfig.ActionConfigWebhook,
        filter,
        locked: actionConfig.locked,
        name,
      });
    case ActionType.TriggerStep:
      if (!actionConfig.ActionConfigTriggerStep)
        throw new GraphQLError("Missing trigger step config.", {
          extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
        });
      return {
        __typename: "TriggerStep",
        name,
        filter,
        stepId: actionConfig.ActionConfigTriggerStep.stepId,
        locked: actionConfig.locked,
      };
    case ActionType.EvolveFlow:
      return {
        __typename: "EvolveFlow",
        name,
        filter,
        locked: actionConfig.locked,
      };
    case ActionType.GroupWatchFlow:
      return {
        __typename: "GroupWatchFlow",
        name,
        filter,
        locked: actionConfig.locked,
      };
    case ActionType.EvolveGroup:
      return {
        __typename: "EvolveGroup",
        name,
        filter,
        locked: actionConfig.locked,
      };
    default:
      throw new GraphQLError("Invalid action type", {
        extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
      });
  }
};
