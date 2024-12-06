import { DiscordApi } from "@discord/api";
import { MePrismaType } from "@/core/user/userPrismaTypes";

export type GraphqlRequestContext = {
  currentUser?: MePrismaType | null;
  discordApi?: DiscordApi;
};

// export type GraphqlRequestContextWithUser = Omit<GraphqlRequestContext, 'currentUser'> & {
//   currentUser: MePrismaType;
// };

export type GraphqlRequestContextWithUser = GraphqlRequestContext & {
  currentUser: NonNullable<GraphqlRequestContext["currentUser"]>;
};