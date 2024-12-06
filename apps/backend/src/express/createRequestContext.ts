import { MePrismaType } from "@/core/user/userPrismaTypes";
import { DiscordApi } from "@/discord/api";
import { GraphqlRequestContext } from "@/graphql/context";

export const createRequestContext = ({
  user,
}: {
  user: MePrismaType | undefined;
}): GraphqlRequestContext => {
  return {
    currentUser: user,
    discordApi: user ? DiscordApi.forUser(user) : undefined,
  };
};
