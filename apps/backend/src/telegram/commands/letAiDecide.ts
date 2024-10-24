import { Message, Update } from "@telegraf/types";
import { Context } from "telegraf";

import {
  FlowConfigGeneration,
  generateNonreusableFlowConfig,
} from "@/core/flow/flowTypes/customFlow/generateNonreusableFlowConfig/generateNonreusableFlowConfig";
import { newCustomFlow } from "@/core/flow/flowTypes/customFlow/newCustomFlow";
import { prisma } from "@/prisma/client";

import { upsertTelegramIdentity } from "../upsertTelegramIdentity";
import { trimCommandMessage } from "../utils/trimCommandMessage";

export const letAiDecide = async ({
  ctx,
}: {
  ctx: Context<{
    message: Update.New & Update.NonChannel & Message.TextMessage;
    update_id: number;
  }>;
}) => {
  const telegramUser = ctx.message.from;
  if (!telegramUser) throw Error("No telegram user found");

  const identity = await upsertTelegramIdentity({ telegramUserData: telegramUser });

  const prompt = trimCommandMessage(ctx.message.text);

  if (prompt.length < 2) {
    ctx.reply("Please provide a complete prompt that you'd like the group to respond to.");
    return;
  }

  const telegramGroup = await prisma.groupTelegramChat.findUniqueOrThrow({
    where: {
      chatId: BigInt(ctx.chat.id),
    },
    include: {
      Group: true,
    },
  });

  const configArgs = generateNonreusableFlowConfig({
    respondEntityId: telegramGroup.Group.entityId,
    prompt,
    type: FlowConfigGeneration.LetAiDecide,
  });

  // new custom flow will also create request and send notification to the relevant groups
  await newCustomFlow({
    args: {
      new: {
        flow: configArgs,
        reusable: false,
      },
    },
    entityContext: { type: "identity", identity },
  });
};
