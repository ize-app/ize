import { DiscordApi } from "@discord/api";
import { MePrismaType } from "@/core/user/userPrismaTypes";

export type GraphqlRequestContext = {
  currentUser?: MePrismaType | null;
  discordApi?: DiscordApi;
};
