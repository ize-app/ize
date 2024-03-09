import { ActionNew, CallWebhook, Option } from "@/graphql/generated/resolver-types";
import { GraphQLError, ApolloServerErrorCode } from "@graphql/errors";
import { ActionNewPrismaType } from "./types";
import { ActionNewType } from "@prisma/client";

export const actionResolver = (
  action: ActionNewPrismaType | null | undefined,
  responseOptions: Option[] | undefined,
): ActionNew | null => {
  if (!action) return null;
  let filterOption: Option | undefined = undefined;

  if (action.filterOptionId) {
    filterOption = (responseOptions ?? []).find(
      (option) => option.optionId === action.filterOptionId,
    );
    if (!filterOption)
      throw new GraphQLError("Cannot find option filter for action", {
        extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
      });
  }

  switch (action.type) {
    case ActionNewType.CallWebhook:
      return callWebhookResolver(action, filterOption);
    case ActionNewType.TriggerStep:
      return {
        __typename: "TriggerStep",
        filterOption,
      };
    case ActionNewType.EvolveFlow:
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
