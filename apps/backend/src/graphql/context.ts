import { DiscordApi } from "@discord/api";
import { UserPrismaType } from "@/utils/formatUser";

export type GraphqlRequestContext = {
  currentUser?: UserPrismaType | null;
  discordApi?: DiscordApi;
};
