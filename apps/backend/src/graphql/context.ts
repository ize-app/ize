import { DiscordApi } from "@discord/api";
import { User } from "@prisma/client";

export type GraphqlRequestContext = {
  currentUser: User | null;
  discordApi: DiscordApi;
};
