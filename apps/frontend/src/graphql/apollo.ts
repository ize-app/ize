import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";

const link = createHttpLink({
  uri: "http://localhost:3000/graphql",
  credentials: "include",
});

export const apolloClient = new ApolloClient({
  cache: new InMemoryCache({
    // apollo client needs help understanding union types
    possibleTypes: {
      Entity: ["Identity", "Group"],
      Field: ["Options", "FreeInput"],
      ResultConfig: ["Decision", "Ranking", "LlmSummary", "Raw", "AutoApprove"],
      ActionNew: ["CallWebhook", "EvolveFlow", "TriggerStep"],
      DecisionTypes: ["AbsoluteDecision", "PercentageDecision"],
      IdentityType: ["IdentityBlockchain", "IdentityEmail", "IdentityDiscord"],
      FieldAnswer: ["OptionFieldAnswer", "FreeInputFieldAnswer"],
    },
  }),
  link,
});
