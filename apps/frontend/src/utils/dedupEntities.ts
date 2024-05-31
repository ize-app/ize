import { EntitySummaryPartsFragment } from "../graphql/generated/graphql";

export const dedupEntities = (agents: EntitySummaryPartsFragment[]) => {
  const uniqueIds: { [key: string]: boolean } = {};
  return agents.filter((agent: EntitySummaryPartsFragment) => {
    if (!uniqueIds[agent.id]) {
      uniqueIds[agent.id] = true;
      return true;
    }
    return false;
  });
};
