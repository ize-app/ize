import { discordQueries } from "./discord_resolvers";
import { groupMutations, groupQueries } from "./group_resolvers";
import { userQueries } from "./user_resolvers";

export const resolvers = {
  Query: {
    ...discordQueries,
    ...userQueries,
    ...groupQueries,
  },
  Mutation: {
    ...groupMutations,
  },
};
