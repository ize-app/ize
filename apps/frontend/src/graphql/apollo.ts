import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";

const graphqlUri = `${import.meta.env.MODE === "development" ? import.meta.env.VITE_LOCAL_BACKEND_URL : window.location.origin}/graphql`;

const link = createHttpLink({
  uri: graphqlUri,
  credentials: "include",
});

export const apolloClient = new ApolloClient({
  cache: new InMemoryCache({
    // apollo client needs help understanding union types
    possibleTypes: {
      Entity: ["Identity", "Group"],
      Field: ["Options", "FreeInput"],
      ResultConfig: ["Decision", "Ranking", "LlmSummary", "LlmSummaryList"],
      Action: [
        "CallWebhook",
        "EvolveFlow",
        "TriggerStep",
        "EvolveGroup",
        "GroupUpdateMetadata",
        "GroupUpdateMembership",
        "GroupWatchFlow",
        "GroupUpdateNotifications",
      ],
      DecisionTypes: ["AbsoluteDecision", "PercentageDecision"],
      IdentityType: ["IdentityBlockchain", "IdentityEmail", "IdentityDiscord", "IdentityTelegram"],
      GroupType: ["DiscordRoleGroup", "GroupNft", "GroupCustom"],
      FieldAnswer: [
        "OptionFieldAnswer",
        "FreeInputFieldAnswer",
        "EntitiesFieldAnswer",
        "FlowsFieldAnswer",
        "WebhookFieldAnswer",
      ],
    },
    typePolicies: {
      Query: {
        fields: {
          getRequestSteps: {
            keyArgs: [
              "userOnly",
              "groupId",
              "flowId",
              "searchQuery",
              "statusFilter",
              "respondPermissionFilter",
            ],
            merge(existing, incoming, { args, readField }) {
              const cursor = args && args.cursor;
              const merged = existing ? existing.slice(0) : [];
              let offset = offsetFromCursor(merged, cursor, readField);
              // If we couldn't find the cursor, default to appending to
              // the end of the list, so we don't lose any data.
              if (offset < 0) offset = merged.length;
              // Now that we have a reliable offset, the rest of this logic
              // is the same as in offsetLimitPagination.
              for (let i = 0; i < incoming.length; ++i) {
                merged[offset + i] = incoming[i];
              }
              return merged;
            },
          },
          getFlows: {
            keyArgs: ["groupId", "searchQuery", "watchFilter", "triggerPermissionFilter"],
            merge(existing, incoming, { args, readField }) {
              const cursor = args && args.cursor;
              const merged = existing ? existing.slice(0) : [];
              let offset = offsetFromCursor(merged, cursor, readField);
              if (offset < 0) offset = merged.length;
              for (let i = 0; i < incoming.length; ++i) {
                merged[offset + i] = incoming[i];
              }
              return merged;
            },
          },
          groupsForCurrentUser: {
            keyArgs: ["searchQuery", "watchFilter"],
            merge(existing, incoming, { args, readField }) {
              const cursor = args && args.cursor;
              const merged = existing ? existing.slice(0) : [];
              let offset = offsetFromCursor(merged, cursor, readField);
              if (offset < 0) offset = merged.length;
              for (let i = 0; i < incoming.length; ++i) {
                merged[offset + i] = incoming[i];
              }
              return merged;
            },
          },
        },
      },
    },
  }),
  link,
});

function offsetFromCursor(items: any[], cursor: string, readField: any): number {
  // Search from the back of the list because the cursor we're
  // looking for is typically the ID of the last item.
  for (let i = items.length - 1; i >= 0; --i) {
    const item = items[i];
    // Using readField works for both non-normalized objects
    // (returning item.id) and normalized references (returning
    // the id field from the referenced entity object), so it's
    // a good idea to use readField when you're not sure what
    // kind of elements you're dealing with.
    if (readField("id", item) === cursor) {
      // Add one because the cursor identifies the item just
      // before the first item in the page we care about.
      return i + 1;
    }
  }
  // Report that the cursor could not be found.
  return -1;
}
