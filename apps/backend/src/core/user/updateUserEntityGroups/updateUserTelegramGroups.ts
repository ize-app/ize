import { GroupType, Prisma } from "@prisma/client";

import { GraphqlRequestContext } from "@/graphql/context";
import { prisma } from "@/prisma/client";
import { telegramBot } from "@/telegram/TelegramClient";

import { upsertForGroupTypeOfEntity } from "./upsertForGroupTypeOfEntity";

export const updateUserTelegramGroups = async ({
  context,
  transaction = prisma,
}: {
  context: GraphqlRequestContext;
  transaction?: Prisma.TransactionClient;
}): Promise<void> => {
  try {
    if (!context.currentUser) throw Error("ERROR Unauthenticated user");
    const tgIdentity = context.currentUser.Identities.find((id) => !!id.IdentityTelegram);
    if (!tgIdentity || !tgIdentity.IdentityTelegram) return;

    const telegramUserId = Number(tgIdentity.IdentityTelegram.telegramUserId);
    const telegramGroups = await prisma.groupTelegramChat.findMany({});

    // check all telegram groups for user membership
    // clunky, but not sure another way around it with the api
    const telegramGroupIds: string[] = [];

    // TODO: might need to revist this once we get 50+ telegram groups
    await Promise.allSettled(
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
            telegramGroupIds.push(telegramGroup.groupId);
            return;
          }
        } catch (e) {
          return;
        }
      }),
    );
    await upsertForGroupTypeOfEntity({
      entityId: tgIdentity.entityId,
      groupIds: telegramGroupIds,
      groupType: GroupType.GroupTelegram,
      transaction,
    });
    return;
  } catch (e) {
    console.log("Error updateUserTelegramGroups: ", e);
    return;
  }
};
