import { Action, CallWebhook, Field, Option } from "@/graphql/generated/resolver-types";
import { GraphQLError, ApolloServerErrorCode } from "@graphql/errors";
import { ActionNewPrismaType } from "./actionPrismaTypes";
import { ActionType, FieldType } from "@prisma/client";

export const resolveAction = (
  action: ActionNewPrismaType | null | undefined,
  responseFields: Field[] | undefined,
): Action | null => {
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

  switch (action.type) {
    case ActionType.CallWebhook:
      return callWebhookResolver(action, filterOption);
    case ActionType.TriggerStep:
      return {
        __typename: "TriggerStep",
        filterOption,
      };
    case ActionType.EvolveFlow:
      return {
        __typename: "EvolveFlow",
        filterOption,
      };
    default:
      throw new GraphQLError("Invalid action type", {
        extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
      });
  }
};

const callWebhookResolver = (
  action: ActionNewPrismaType,
  filterOption: Option | undefined,
): CallWebhook => {
  const webhook = action.Webhook;
  if (!webhook)
    throw new GraphQLError("Missing webhook action config.", {
      extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
    });
  return {
    __typename: "CallWebhook",
    uri: webhook.uri,
    name: webhook.name,
    filterOption,
  };
};
