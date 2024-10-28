import { ActionType, FieldType } from "@prisma/client";

import { Action, Field, Group, Option } from "@/graphql/generated/resolver-types";
import { ApolloServerErrorCode, GraphQLError } from "@graphql/errors";

import { ActionNewPrismaType } from "./actionPrismaTypes";
import { getActionName } from "./getActionName";
import { callWebhookResolver } from "./webhook/webhookResolver";

export const actionResolver = ({
  action,
  responseFields,
  ownerGroup,
}: {
  action: ActionNewPrismaType | null | undefined;
  responseFields: Field[] | undefined;
  ownerGroup: Group | null;
}): Action | null => {
  if (!action) return null;
  let filterOption: Option | undefined = undefined;

  if (action.filterOptionId && responseFields) {
    for (let i = 0; i < responseFields.length; i++) {
      const field = responseFields[i];
      if (field.__typename === FieldType.Options) {
        const option = field.options.find((option) => option.optionId === action.filterOptionId);
        if (option) {
          filterOption = option;
          break;
        }
      }
    }

    if (!filterOption)
      throw new GraphQLError("Cannot find option filter for action", {
        extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
      });
  }

  const name = getActionName({ action, ownerGroup });

  switch (action.type) {
    case ActionType.CallWebhook:
      if (!action.Webhook)
        throw new GraphQLError("Missing webhook action config.", {
          extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
        });
      return callWebhookResolver({
        webhook: action.Webhook,
        filterOption,
        locked: action.locked,
        name,
      });
    case ActionType.TriggerStep:
      return {
        __typename: "TriggerStep",
        name,
        filterOption,
        locked: action.locked,
      };
    case ActionType.EvolveFlow:
      return {
        __typename: "EvolveFlow",
        name,
        filterOption,
        locked: action.locked,
      };
    case ActionType.GroupWatchFlow:
      return {
        __typename: "GroupWatchFlow",
        name,
        filterOption,
        locked: action.locked,
      };
    case ActionType.EvolveGroup:
      return {
        __typename: "EvolveGroup",
        name,
        filterOption,
        locked: action.locked,
      };
    default:
      throw new GraphQLError("Invalid action type", {
        extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
      });
  }
};
