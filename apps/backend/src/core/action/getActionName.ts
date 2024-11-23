import { ActionType, Group } from "@/graphql/generated/resolver-types";
import { ApolloServerErrorCode, GraphQLError } from "@graphql/errors";

import { ActionConfigPrismaType } from "./actionPrismaTypes";

export const getActionName = ({
  action,
  ownerGroup,
}: {
  action: ActionConfigPrismaType;
  ownerGroup: Group | null;
}): string => {
  switch (action.type) {
    case ActionType.CallWebhook:
      if (!action.ActionConfigWebhook) return "Call webhook";
      else return action.ActionConfigWebhook.name;
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
