import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { FlowSummaryFragment } from "./generated/graphql";

const graphqlUri = `${import.meta.env.MODE === "development" ? import.meta.env.VITE_LOCAL_BACKEND_URL : window.location.origin}/graphql`;

const link = createHttpLink({
  uri: graphqlUri,
  credentials: "include",
});

export const apolloClient = new ApolloClient({
  cache: new InMemoryCache({
    // apollo client needs help understanding union types
    possibleTypes: {
      Entity: ["Identity", "Group", "User"],
      Value: [
        "OptionSelectionsValue",
        "StringValue",
        "FloatValue",
        "UriValue",
        "DateValue",
        "DateTimeValue",
        "EntitiesValue",
        "FlowsValue",
        "FlowVersionValue",
      ],
      OptionValue: [
        "StringValue",
        "FloatValue",
        "UriValue",
        "DateValue",
        "DateTimeValue",
        "EntitiesValue",
        "FlowsValue",
        "FlowVersionValue",
      ],
      ResultConfig: ["Decision", "Ranking", "LlmSummary", "RawAnswers"],
      Action: ["CallWebhook", "EvolveFlow", "TriggerStep", "EvolveGroup", "GroupWatchFlow"],
      DecisionTypes: ["AbsoluteDecision", "PercentageDecision", "WeightedAverage", "Ai"],
      IdentityType: ["IdentityBlockchain", "IdentityEmail", "IdentityDiscord", "IdentityTelegram"],
      GroupType: ["DiscordRoleGroup", "GroupNft", "GroupIze", "GroupTelegramChat "],
    },
    typePolicies: {
      Query: {
        fields: {
          getRequests: {
            keyArgs: [
              "groupId",
              "flowId",
              "searchQuery",
              "watchedByUserGroups",
              "watchedByUser",
              "createdByUser",
              "open",
              "hasRespondPermission",
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
            keyArgs: [
              "groupId",
              "searchQuery",
              "watchedByUser",
              "watchedByUserGroups",
              "createdByUser",
              "hasTriggerPermissions",
              "excludeGroupId",
            ],
            // used a different merge function here to solve a problem
            // multiple getFlow queries happening on a single page
            // this problem is no longer relevant, but keeping this modified merge function here for reference
            merge(existing, incoming, { args, readField }) {
              const cursor = args?.cursor;
              const merged = existing ? existing.slice(0) : [];

              // Deduplicate results if they already exist
              const incomingFiltered = incoming.filter((item: FlowSummaryFragment) => {
                const itemId = readField("flowId", item);
                return !merged.some(
                  (existingItem: FlowSummaryFragment) =>
                    readField("flowId", existingItem) === itemId,
                );
              });

              let offset = offsetFromCursor(merged, cursor, readField);
              if (offset < 0) offset = merged.length;
              for (let i = 0; i < incomingFiltered.length; ++i) {
                merged[offset + i] = incomingFiltered[i];
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
