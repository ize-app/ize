import { ActionFragment, EntitySummaryPartsFragment } from "@/graphql/generated/graphql";

import { actionProperties } from "./actionProperties";

export const getActionLabel = (
  action: ActionFragment,
  entity: EntitySummaryPartsFragment | null | undefined,
) => {
  if (entity) {
    return `${actionProperties[action.__typename].label} for ${entity.name}`;
  } else return actionProperties[action.__typename].label;
};
