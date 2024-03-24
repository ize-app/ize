import { DiscordApi } from "@discord/api";
import { MePrismaType } from "@/core/user/formatUser";

export type GraphqlRequestContext = {
  currentUser?: MePrismaType | null;
  discordApi?: DiscordApi;
};
