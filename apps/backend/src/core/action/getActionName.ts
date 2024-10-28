import { ActionType, Group } from "@/graphql/generated/resolver-types";
import { ApolloServerErrorCode, GraphQLError } from "@graphql/errors";

import { ActionNewPrismaType } from "./actionPrismaTypes";

export const getActionName = ({
  action,
  ownerGroup,
}: {
  action: ActionNewPrismaType;
  ownerGroup: Group | null;
}): string => {
  switch (action.type) {
    case ActionType.CallWebhook:
      if (!action.Webhook) return "Call webhook";
      else return action.Webhook.name;
    case ActionType.TriggerStep:
      return "Trigger a new step";
    case ActionType.EvolveFlow:
      return "Evolve flow";
    case ActionType.GroupWatchFlow:
      return `Watch/unwatch flow${ownerGroup ? ` for ${ownerGroup.name}` : ""}`;
    case ActionType.EvolveGroup:
      return `Evolve group${ownerGroup ? `: ${ownerGroup.name}` : ""}`;
    default:
      throw new GraphQLError("Invalid action type", {
        extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
      });
  }
};
