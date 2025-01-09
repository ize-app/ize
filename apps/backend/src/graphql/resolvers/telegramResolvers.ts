import { getTelegramChats } from "@/telegram/getTelegramChats";
import { GraphqlRequestContext } from "../context";
import { QueryResolvers, QueryTelegramChatsArgs } from "../generated/resolver-types";
import { logResolverError } from "../logResolverError";

// Returns all of a users discord servers, regardless of whether they connected Ize bot
export const telegramChats: QueryResolvers["telegramChats"] = async (
  root: unknown,
  args: QueryTelegramChatsArgs,
  context: GraphqlRequestContext,
) => {
  try {
    return await getTelegramChats({ context, args });
  } catch (error) {
    return logResolverError({
      error,
      sentryOptions: {
        tags: { resolver: "telegramChats", operation: "query" },
        contexts: { args },
      },
    });
  }
};

export const telegramQueries = {
  telegramChats,
};
