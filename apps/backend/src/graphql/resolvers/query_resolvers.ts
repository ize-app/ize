import { discordQueries } from "./discord_resolvers";
import { userQueries } from "./user_resolvers";

export const resolvers = {
  Query: {
    ...discordQueries,
    ...userQueries,
  },
};
