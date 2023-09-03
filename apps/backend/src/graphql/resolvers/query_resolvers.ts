import { discordQueries } from "./discord_resolvers";
import { groupMutations } from "./group_resolvers";
import { userQueries } from "./user_resolvers";

export const resolvers = {
  Query: {
    ...discordQueries,
    ...userQueries,
  },
  Mutation: {
    ...groupMutations,
  },
};
