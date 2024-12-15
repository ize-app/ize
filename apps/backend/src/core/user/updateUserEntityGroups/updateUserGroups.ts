import { createRequestContext } from "@/express/createRequestContext";
import { prisma } from "@/prisma/client";

import { updateUserIzeGroups } from "./updateUserCustomGroups";
import { updateUserDiscordGroups } from "./updateUserDiscordGroups";
import { updateUserNftGroups } from "./updateUserNftGroups";
import { updateUserTelegramGroups } from "./updateUserTelegramGroups";
import { meInclude } from "../userPrismaTypes";

// purpose of updateUserGroups is to update all group associations for a user at once
export const upsertUserEntityGroups = async ({ userId }: { userId: string }) => {
  const user = await prisma.user.findFirstOrThrow({ include: meInclude, where: { id: userId } });
  const context = createRequestContext({ user });

  try {
    if (!context.currentUser) return;
    await Promise.allSettled([
      await updateUserDiscordGroups({ context }),
      await updateUserNftGroups({ context }),
      await updateUserTelegramGroups({ context }),
    ]);
    await updateUserIzeGroups({ context });
  } catch (e) {
    console.log("updateUserGroups Error: ", e);
  }
};
