import { DiscordApi } from "@discord/api";
import { MePrismaType } from "@/utils/formatUser";

export type GraphqlRequestContext = {
  currentUser?: MePrismaType | null;
  discordApi?: DiscordApi;
};
