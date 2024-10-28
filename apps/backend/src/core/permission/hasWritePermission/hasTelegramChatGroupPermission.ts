import { GroupTelegramChatPrismaType } from "@/core/entity/group/groupPrismaTypes";
import { IdentityPrismaType } from "@/core/entity/identity/identityPrismaTypes";
import { upsertIdentityGroup } from "@/core/entity/updateIdentitiesGroups/upsertIdentityGroup";
import { telegramBot } from "@/telegram/TelegramClient";

// checks whether user has permission according to their discord @roles
// for a given set of request or respond roles.
// optimized for minimizing the number of discord API queries
export const hasTelegramChatGroupPermission = async ({
  identities,
  telegramGroups,
}: {
  telegramGroups: GroupTelegramChatPrismaType[];

  identities: IdentityPrismaType[];
}): Promise<boolean> => {
  // for now, there is only one discord account per user
  const telegramIdentity = identities.find((id) => !!id.IdentityTelegram);
  if (!telegramIdentity?.IdentityTelegram) return false;

  for (let i = 0; i <= telegramGroups.length - 1; i++) {
    const telegramGroup = telegramGroups[i];
    try {
      const chatMember = await telegramBot.telegram.getChatMember(
        telegramGroup.chatId.toString(),
        Number(telegramIdentity.IdentityTelegram.telegramUserId),
      );
      if (
        chatMember.status === "creator" ||
        chatMember.status === "administrator" ||
        chatMember.status === "member"
      ) {
        // updating identities_groups association because we can't query all of a user's telegram chats
        // like we do with other platforms
        upsertIdentityGroup({
          identityId: telegramIdentity.id,
          groupId: telegramGroup.groupId,
          active: true,
        });
        return true;
      } else {
        upsertIdentityGroup({
          identityId: telegramIdentity.id,
          groupId: telegramGroup.groupId,
          active: false,
        });
        return false;
      }
    } catch (e) {
      return false;
      // if telegram call throws error, user is not in the chat
      // I don't think updating identity_groups is necessary here because
      // I think telegram API would return chatMember if user used to be in the chat
      // updateIdentityGroups({
      //   identityId: telegramIdentity.id,
      //   groupId: telegramGroup.groupId,
      //   active: false,
      // });
    }
  }

  return false;
};
