import { IdentityTelegram } from "@prisma/client";

import { upsertEntityGroup } from "@/core/entity/updateEntitiesGroups/upsertEntityGroup";
import { prisma } from "@/prisma/client";
import { telegramBot } from "@/telegram/TelegramClient";

export const getTelegramIdentityChatGroups = async (
  tgIdentity: IdentityTelegram | null,
  telegramIdentityEntityId: string,
) => {
  if (!tgIdentity) return;
  const telegramUserId = Number(tgIdentity.telegramUserId);
  const telegramGroups = await prisma.groupTelegramChat.findMany({});

  // check all telegram groups for user membership
  // clunky, but not sure another way around it with the api
  Promise.allSettled(
    telegramGroups.map(async (telegramGroup) => {
      // const telegramGroup = telegramGroups[i];
      try {
        const chatMember = await telegramBot.telegram.getChatMember(
          telegramGroup.chatId.toString(),
          telegramUserId,
        );
        if (
          chatMember.status === "creator" ||
          chatMember.status === "administrator" ||
          chatMember.status === "member"
        ) {
          // updating identities_groups association because we can't query all of a user's telegram chats
          // like we do with other platforms
          upsertEntityGroup({
            entityId: telegramIdentityEntityId,
            groupId: telegramGroup.groupId,
            active: true,
          });
          return true;
        }
      } catch (e) {
        return false;
      }
    }),
  );
};
