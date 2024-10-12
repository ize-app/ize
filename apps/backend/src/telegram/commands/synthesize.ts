import { Message, Update } from "@telegraf/types";
import { Context } from "telegraf";

import { newCustomFlow } from "@/core/flow/flowTypes/customFlow/newCustomFlow";
import {
  FlowConfigGeneration,
  generateNonreusableFlowConfig,
} from "@/core/flow/generateNonreusableFlowConfig/generateNonreusableFlowConfig";
import { prisma } from "@/prisma/client";

import { upsertTelegramIdentity } from "../upsertTelegramIdentity";

export const synthesize = async ({
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
  const rawPrompt = ctx.message.text;

  // remove first word (command) from prompt and all trailing leading spaces
  const prompt = rawPrompt.replace(/^\s*\S+\s*/, "").trim();

  if (prompt.length < 2) {
    ctx.reply("Please provide a complete question that you'd like to the group to respond to.");
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
    configArgs: { prompt, type: FlowConfigGeneration.Synthesize },
  });

  // new custom flow will also create request and send notification to the relevant groups
  await newCustomFlow({
    args: { flow: configArgs },
    entityContext: { type: "identity", identity },
  });
};
