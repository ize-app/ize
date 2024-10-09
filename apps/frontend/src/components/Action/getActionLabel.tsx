import {
  ActionFragment,
  EntityFragment,
} from "@/graphql/generated/graphql";

import { actionProperties } from "./actionProperties";

export const getActionLabel = (
  action: ActionFragment,
  entity: EntityFragment | null | undefined,
) => {
  if (entity) {
    return `${actionProperties[action.__typename].label} for ${entity.name}`;
  } else return actionProperties[action.__typename].label;
};
