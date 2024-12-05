import { prisma } from "@/prisma/client";

export const getGroupsForTelegramChat = async (
  telegramChatId: number,
): Promise<{ telegramGroupEntityId: string; izeGroupIds: string[] }> => {
  const telegramGroup = await prisma.groupTelegramChat.findUniqueOrThrow({
    where: {
      chatId: BigInt(telegramChatId),
    },
    include: {
      Group: {
        include: { Entity: { include: { NotifiesForIzeGroups: true } } },
      },
    },
  });

  return {
    telegramGroupEntityId: telegramGroup.Group.entityId,
    izeGroupIds: telegramGroup.Group.Entity.NotifiesForIzeGroups.map(
      (izeGroup) => izeGroup.groupId,
    ),
  };
};
