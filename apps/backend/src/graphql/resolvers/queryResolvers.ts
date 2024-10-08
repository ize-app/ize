import { blockchainQueries } from "./blockchainResolvers";
import { discordQueries } from "./discordResolvers";
import { entityMutations, entityQueries } from "./entityResolvers";
import { userMutations, userQueries } from "./userResolvers";
import { requestMutations, requestQueries } from "./requestResolvers";
import { flowMutations, flowQueries } from "./flowResolvers";
import { actionMutations } from "./actionResolvers";
import { telegramQueries } from "./telegramResolvers";

export const resolvers = {
  Query: {
    ...blockchainQueries,
    ...discordQueries,
    ...telegramQueries,
    ...userQueries,
    ...entityQueries,
    ...requestQueries,
    ...flowQueries,
  },
  Mutation: {
    ...entityMutations,
    ...requestMutations,
    ...flowMutations,
    ...actionMutations,
    ...userMutations,
  },
};
