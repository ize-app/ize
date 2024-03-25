import { blockchainQueries } from "./blockchainResolvers";
import { discordQueries } from "./discordResolvers";
import { entityMutations, entityQueries } from "./entityResolvers";
import { userQueries } from "./userResolvers";
import { requestMutations, requestQueries } from "./requestResolvers";
import { flowMutations, flowQueries } from "./flowResolvers";

export const resolvers = {
  Query: {
    ...blockchainQueries,
    ...discordQueries,
    ...userQueries,
    ...entityQueries,
    ...requestQueries,
    ...flowQueries,
  },
  Mutation: {
    ...entityMutations,
    ...requestMutations,
    ...flowMutations,
  },
};
