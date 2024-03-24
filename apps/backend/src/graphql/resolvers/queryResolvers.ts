import { blockchainQueries } from "./blockchainResolvers";
import { discordQueries } from "./discordResolvers";
import { groupMutations, groupQueries } from "./groupResolvers";
import { userQueries } from "./userResolvers";
import { requestMutations, requestQueries } from "./requestResolvers";
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
