import { userQueries } from "./user_resolvers";

export const resolvers = {
  Query: {
    ...userQueries,
  },
};
