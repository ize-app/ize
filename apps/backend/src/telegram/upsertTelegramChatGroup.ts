import { GroupType } from "@prisma/client";

import { prisma } from "@/prisma/client";

export const upsertTelegramChatGroup = async ({
  chatId,
  title,
  messageThreadId,
  adminTelegramUserId,
  creatorEntityId,
}: {
  chatId: number;
  title: string;
  messageThreadId: number | undefined;
  adminTelegramUserId: number;
  creatorEntityId: string;
}) => {
  const existingGroup = await prisma.groupTelegramChat.findFirst({
    where: {
      chatId,
    },
  });

  let groupId: string;

  if (existingGroup) {
    const group = await prisma.groupTelegramChat.update({
      where: {
        chatId,
      },
      data: {
        name: title,
        messageThreadId: messageThreadId ?? null,
        adminTelegramUserId,
      },
    });
    groupId = group.groupId;
  } else {
    const entity = await prisma.entity.create({
      include: {
        Group: true,
      },
      data: {
        Group: {
          create: {
            type: GroupType.GroupTelegram,
            creatorEntityId,
            GroupTelegramChat: {
              create: {
                chatId,
                name: title,
                adminTelegramUserId,
                messageThreadId,
              },
            },
          },
        },
      },
    });
    groupId = entity.Group?.id as string;
  }

  return groupId;
};
