import { getDiscordServers } from "@/discord/getDiscordServers";
import { GraphqlRequestContext } from "@/graphql/context";

import { updateUserCustomGroups } from "./updateUserCustomGroups";
import { updateUserDiscordGroups } from "./updateUserDiscordGroups";
import { updateUserNftGroups } from "./updateUserNftGroups";

export const updateUserGroups = async ({ context }: { context: GraphqlRequestContext }) => {
  try {
    if (!context.currentUser) return;
    const discordServers = await getDiscordServers({ context });
    await updateUserDiscordGroups({ context, discordServers });
    await updateUserNftGroups({ context });
    await updateUserCustomGroups({ context });
  } catch (e) {
    console.log("updateUserGroups Error: ", e);
  }
};
