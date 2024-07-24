import { ActionType, FieldType } from "@prisma/client";
import { parse } from "tldts";

import { Action, CallWebhook, Field, Option } from "@/graphql/generated/resolver-types";
import { ApolloServerErrorCode, GraphQLError } from "@graphql/errors";

import { ActionNewPrismaType } from "./actionPrismaTypes";

export const actionResolver = (
  action: ActionNewPrismaType | null | undefined,
  responseFields: Field[] | undefined,
  hideSensitiveInfo = true,
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
      return callWebhookResolver(action, filterOption, hideSensitiveInfo);
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
    case ActionType.GroupUpdateMetadata:
      return {
        __typename: "GroupUpdateMetadata",
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
  obscureUri = true,
): CallWebhook => {
  const webhook = action.Webhook;
  if (!webhook)
    throw new GraphQLError("Missing webhook action config.", {
      extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
    });
  return {
    __typename: "CallWebhook",
    uri: obscureUri ? "https://" + parse(webhook.uri).domain ?? "" : webhook.uri, // Only return the hostname for privacy
    name: webhook.name,
    filterOption,
  };
};
