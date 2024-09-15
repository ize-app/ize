import { GraphqlRequestContext } from "@/graphql/context";
import { ApolloServerErrorCode, CustomErrorCodes, GraphQLError } from "@/graphql/errors";
import { prisma } from "@/prisma/client";
import { telegramBot } from "@/telegram/TelegramClient";

import { entityInclude } from "../entity/entityPrismaTypes";

// this funciton confirms that a user has the right to send notifications through a given group
export const confirmNotificationEntity = async ({
  entityId,
  context,
}: {
  entityId: string;
  context: GraphqlRequestContext;
}) => {
  if (!context.currentUser)
    throw new GraphQLError("Unauthenticated", {
      extensions: { code: CustomErrorCodes.Unauthenticated },
    });
  // get entity
  const telegramIdentity = context.currentUser.Identities.find(
    (id) => !!id.IdentityTelegram?.telegramUserId,
  );

  if (!telegramIdentity?.IdentityTelegram)
    throw new GraphQLError("Missing Telegram identity", {
      extensions: { code: CustomErrorCodes.Unauthenticated },
    });

  const entity = await prisma.entity.findUnique({
    include: entityInclude,
    where: { id: entityId },
  });
  const telegramGroup = entity?.Group?.GroupTelegramChat;
  // if entity is not telegram, throw an error
  if (!telegramGroup)
    throw new GraphQLError("Unauthenticated", {
      extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
    });
  // if Telegram, confirm that user has admin rights

  const chatMember = await telegramBot.telegram.getChatMember(
    telegramGroup.chatId.toLocaleString(),
    Number(telegramIdentity.IdentityTelegram.telegramUserId),
  );

  if (chatMember.status !== "creator" && chatMember.status !== "administrator")
    throw new GraphQLError(
      `Telegram identity does not have admin privleges over Telegram chat ${telegramGroup.chatId.toLocaleString()}`,
      {
        extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
      },
    );
};
