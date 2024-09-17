import { GroupTelegramChatPrismaType } from "@/core/entity/group/groupPrismaTypes";
import { telegramBot } from "@/telegram/TelegramClient";
import { GraphqlRequestContext } from "@graphql/context";

// checks whether user has permission according to their discord @roles
// for a given set of request or respond roles.
// optimized for minimizing the number of discord API queries
export const hasTelegramChatGroupPermission = async ({
  context,
  telegramGroups,
}: {
  telegramGroups: GroupTelegramChatPrismaType[];

  context: GraphqlRequestContext;
}): Promise<boolean> => {
  if (!context.currentUser) throw Error("ERROR Unauthenticated user");

  // for now, there is only one discord account per user
  const telegramIdentity = context.currentUser.Identities.find((id) => !!id.IdentityTelegram);
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
        return true;
      }
    } catch {
      // if telegram call throws error, user is not in the chat
    }
  }

  return false;
};
