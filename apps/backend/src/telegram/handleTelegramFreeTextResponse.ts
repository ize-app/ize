/* eslint-disable @typescript-eslint/no-unsafe-assignment*/
import * as Sentry from "@sentry/node";
import { Message } from "@telegraf/types";
import { Context } from "telegraf";

import { identityInclude } from "@/core/entity/identity/identityPrismaTypes";
import { newResponse } from "@/core/response/newResponse";
import { prisma } from "@/prisma/client";

import { upsertTelegramIdentity } from "./upsertTelegramIdentity";

export const handleTelegramFreeTextResponse = async ({
  message,
  ctx,
}: {
  message: Message;
  ctx: Context;
}) => {
  let identityEntityId: string | undefined = undefined;
  let groupEntityId: string | undefined = undefined;

  try {
    //@ts-expect-error  reply field isn't in the type
    //eslint-disable-next-line
    const replyMessageId = message?.reply_to_message?.message_id as string;
    //@ts-expect-error  reply field isn't in the type
    const textResponse = message.text as string;
    const userId = message.from?.id;
    const chatId = message.chat.id;

    if (!replyMessageId) return;

    const telegramGroup = await prisma.groupTelegramChat.findFirst({
      where: {
        chatId: BigInt(chatId),
      },
      include: {
        Group: true,
      },
    });

    groupEntityId = telegramGroup?.Group.entityId;

    //eslint-disable-next-line
    const fieldPrompt = await prisma.telegramMessages.findFirst({
      where: { messageId: BigInt(replyMessageId) },
    });

    if (!fieldPrompt) return;

    const { requestStepId, fieldId } = fieldPrompt;

    if (!fieldId) return;

    if (!message.from) return;

    const identity = await upsertTelegramIdentity({ telegramUserData: message.from });
    identityEntityId = identity.entityId;

    prisma.identity.findFirstOrThrow({
      include: identityInclude,
      where: {
        IdentityTelegram: {
          telegramUserId: userId,
        },
      },
    });

    await newResponse({
      entityContext: { type: "identity", identity },
      args: {
        response: {
          responseId: crypto.randomUUID(),
          answers: [
            {
              fieldId: fieldId,
              value: JSON.stringify(textResponse),
            },
          ],
          requestStepId,
        },
      },
    });

    // create message record so that if someone replies to this response rather than the original prompt, we can still track the response
    // this creates a pseudo-thread in the db
    //eslint-disable-next-line
    await prisma.telegramMessages.create({
      data: {
        fieldId,
        chatId: BigInt(chatId),
        requestStepId,
        messageId: BigInt(message.message_id),
      },
    });

    ctx.react("👀");
  } catch (error) {
    Sentry.captureException(error, {
      tags: { location: "telegram", interaction: "freeTextResponse" },
      contexts: {
        // args: { message },
        telegram: { identityEntityId, groupEntityId },
      },
    });
  }
};
