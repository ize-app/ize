import { GroupType } from "@prisma/client";

import { prisma } from "@/prisma/client";

export const upsertTelegramChatGroup = async ({
  chatId,
  title,
  messageThreadId,
  creatorTelegramId,
}: {
  chatId: number;
  title: string;
  messageThreadId: number | undefined;
  creatorTelegramId: number;
}) => {
  const existingGroup = await prisma.groupTelegramChat.findFirst({
    where: {
      chatId,
    },
  });

  if (existingGroup) {
    await prisma.groupTelegramChat.update({
      where: {
        chatId,
      },
      data: {
        name: title,
        messageThreadId: messageThreadId ?? null,
      },
    });
  } else {
    await prisma.entity.create({
      data: {
        Group: {
          create: {
            type: GroupType.GroupTelegram,
            GroupTelegramChat: {
              create: {
                chatId,
                name: title,
                creatorTelegramId,
                messageThreadId,
              },
            },
          },
        },
      },
    });
  }
};
