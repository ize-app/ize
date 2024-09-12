import { getTelegramChats } from "@/telegram/getTelegramChats";
import { GraphqlRequestContext } from "../context";
import { QueryResolvers } from "../generated/resolver-types";

// Returns all of a users discord servers, regardless of whether they connected Ize bot
export const telegramChats: QueryResolvers["telegramChats"] = async (
  root: unknown,
  args: {},
  context: GraphqlRequestContext,
) => {
  return await getTelegramChats({ context });
};

export const telegramQueries = {
  telegramChats,
};
