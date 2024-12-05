import { Message, Update } from "@telegraf/types";
import { Context } from "telegraf";

import { newCustomFlow } from "@/core/flow/flowTypes/customFlow/newCustomFlow";
import {
  FlowConfigGeneration,
  generateNonreusableFlowConfig,
} from "@/core/flow/generateFlowArgs/generateNonreusableFlowConfig/generateNonreusableFlowConfig";

import { upsertTelegramIdentity } from "../upsertTelegramIdentity";
import { getGroupsForTelegramChat } from "../utils/getTelegramGroupOfTelegramChat";
import { trimCommandMessage } from "../utils/trimCommandMessage";

export const ideate = async ({
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

  // remove first word (command) from prompt and all trailing leading spaces
  const prompt = trimCommandMessage(ctx.message.text);

  if (prompt.length < 2) {
    ctx.reply("Please provide a complete question that you'd like to the group to respond to.");
    return;
  }

  const { telegramGroupEntityId, izeGroupIds } = await getGroupsForTelegramChat(ctx.chat.id);

  const configArgs = generateNonreusableFlowConfig({
    respondEntityId: telegramGroupEntityId,
    prompt,
    type: FlowConfigGeneration.Ideate,
  });

  // new custom flow will also create request and send notification to the relevant groups
  await newCustomFlow({
    args: {
      newFlow: {
        new: {
          flow: configArgs,
          reusable: false,
        },
        groupsToWatch: izeGroupIds,
        requestName: prompt,
      },
    },
    entityContext: { type: "identity", identity },
  });
};
