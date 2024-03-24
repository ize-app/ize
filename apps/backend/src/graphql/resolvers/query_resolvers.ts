import { blockchainQueries } from "./blockchain_resolvers";
import { discordQueries } from "./discord_resolvers";
import { groupMutations, groupQueries } from "./group_resolvers";
import { userQueries } from "./user_resolvers";
import { requestMutations, requestQueries } from "./request_resolvers";
import { flowMutations, flowQueries } from "./flowResolvers";

export const resolvers = {
  Query: {
    ...blockchainQueries,
    ...discordQueries,
    ...userQueries,
    ...groupQueries,
    ...requestQueries,
    ...flowQueries,
  },
  Mutation: {
    ...groupMutations,
    ...requestMutations,
    ...flowMutations,
  },
};
