import { helloQueries } from "./hello_resolvers";

export const resolvers = {
  Query: {
    ...helloQueries,
  },
};
