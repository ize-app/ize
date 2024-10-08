import { getTelegramChats } from "@/telegram/getTelegramChats";
import { GraphqlRequestContext } from "../context";
import { QueryResolvers, QueryTelegramChatsArgs } from "../generated/resolver-types";

// Returns all of a users discord servers, regardless of whether they connected Ize bot
export const telegramChats: QueryResolvers["telegramChats"] = async (
  root: unknown,
  args: QueryTelegramChatsArgs,
  context: GraphqlRequestContext,
) => {
  return await getTelegramChats({ context, args });
};

export const telegramQueries = {
  telegramChats,
};
