import { EntityFragment } from "../graphql/generated/graphql";

export const dedupEntities = (agents: EntityFragment[]) => {
  const uniqueIds: { [key: string]: boolean } = {};
  return agents.filter((agent: EntityFragment) => {
    if (!uniqueIds[agent.id]) {
      uniqueIds[agent.id] = true;
      return true;
    }
    return false;
  });
};
