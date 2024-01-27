import { blockchainQueries } from "./blockchain_resolvers";
import { discordQueries } from "./discord_resolvers";
import { groupMutations, groupQueries } from "./group_resolvers";
import { userQueries } from "./user_resolvers";
import { processMutations, processQueries } from "./process_resolvers";
import { requestMutations, requestQueries } from "./request_resolvers";

export const resolvers = {
  Query: {
    ...blockchainQueries,
    ...discordQueries,
    ...userQueries,
    ...groupQueries,
    ...processQueries,
    ...requestQueries,
  },
  Mutation: {
    ...groupMutations,
    ...processMutations,
    ...requestMutations,
  },
};
