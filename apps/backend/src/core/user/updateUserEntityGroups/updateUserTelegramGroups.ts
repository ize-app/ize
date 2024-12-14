import { Prisma } from "@prisma/client";

import { GraphqlRequestContext } from "@/graphql/context";
import { prisma } from "@/prisma/client";
import { telegramBot } from "@/telegram/TelegramClient";

// updating a users telegram groups works differently than the other identity types
// this is because telegram doesn't offer a way to get all groups a user is in
// so instead, we need to check each group individually to see if the user is a member
// this will become unmanageable once there are 100 + telegram groups in Ize
// so we only query for 50 most recent groups at a time and the entities_groups update logic is different
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

    // findn all telegram
    const telegramGroups = await prisma.groupTelegramChat.findMany({
      where: {
        Group: {
          EntitiesInGroup: {
            none: {
              entityId: tgIdentity.entityId,
            },
          },
        },
      },
      take: 40,
      orderBy: {
        createdAt: "desc",
      },
    });

    // check all telegram groups for user membership
    // clunky, but not sure another way around it with the api
    const memberGroupIds: string[] = [];
    const notMemberGroupIds: string[] = [];

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
            memberGroupIds.push(telegramGroup.groupId);
            return;
          } else {
            notMemberGroupIds.push(telegramGroup.groupId);
            return;
          }
        } catch (e) {
          notMemberGroupIds.push(telegramGroup.groupId);
          return;
        }
      }),
    );

    // NOT using upsertForGroupTypeOfEntity
    // because we can't get all of a users telegram groups at once
    await transaction.entityGroup.createMany({
      data: memberGroupIds.map((groupId) => ({
        groupId,
        active: true,
        entityId: tgIdentity.entityId,
      })),
      skipDuplicates: true,
    });

    await transaction.entityGroup.createMany({
      data: notMemberGroupIds.map((groupId) => ({
        groupId,
        active: false,
        entityId: tgIdentity.entityId,
      })),
      skipDuplicates: true,
    });
    return;
  } catch (e) {
    console.log("Error updateUserTelegramGroups: ", e);
    return;
  }
};
