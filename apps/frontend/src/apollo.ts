import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";

const link = createHttpLink({
  uri: "http://localhost:3000/graphql",
  credentials: "include",
});

export const apolloClient = new ApolloClient({
  cache: new InMemoryCache({
    possibleTypes: {
      Agent: ["User", "Group"],
      DecisionTypes: ["AbsoluteDecision", "PercentageDecision"],
      Identity: ["IdentityBlockchain", "IdentityEmail", "IdentityDiscord"],
    },
  }),
  link,
});
