import { getUserEntityIds } from "@/core/user/getUserEntityIds";
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
    userEntityIds: getUserEntityIds(user),
    discordApi: user ? DiscordApi.forUser(user) : undefined,
  };
};
