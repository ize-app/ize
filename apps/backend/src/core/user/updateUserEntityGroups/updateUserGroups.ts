import { getDiscordServers } from "@/discord/getDiscordServers";
import { GraphqlRequestContext } from "@/graphql/context";

import { updateUserIzeGroups } from "./updateUserCustomGroups";
import { updateUserDiscordGroups } from "./updateUserDiscordGroups";
import { updateUserNftGroups } from "./updateUserNftGroups";

// purpose of updateUserGroups is to update all group associations for a user at once
export const upsertUserEntityGroups = async ({ context }: { context: GraphqlRequestContext }) => {
  try {
    if (!context.currentUser) return;
    const discordServers = await getDiscordServers({ context });
    await updateUserDiscordGroups({ context, discordServers });
    await updateUserNftGroups({ context });
    await updateUserIzeGroups({ context });
  } catch (e) {
    console.log("updateUserGroups Error: ", e);
  }
};
