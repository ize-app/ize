import { prisma } from "@/prisma/client";

import { sendTelegramResultsNotifications } from "./sendTelegramResultsNotifications";
import { createResultsPayload } from "../createResultsPayload";
import { getGroupsToNotify } from "../getGroupsToNotifiy";

export const sendResultNotifications = async ({ requestStepId }: { requestStepId: string }) => {
  // get flow Id
  const req = await prisma.requestStep.findFirstOrThrow({
    where: {
      id: requestStepId,
    },
    include: {
      Request: {
        include: { FlowVersion: true },
      },
    },
  });

  const groups = await getGroupsToNotify(req.Request.FlowVersion.flowId);

  if (groups.length === 0) {
    return;
  }

  // get all flow / request info
  // TODO: make it return only result from this step
  const resultsPayload = await createResultsPayload({ requestStepId });

  if (!resultsPayload) return;

  const telegramGroups = groups
    .map((group) => group.GroupCustom?.NotificationEntity?.Group?.GroupTelegramChat)
    .filter((tgGroup) => !!tgGroup);

  sendTelegramResultsNotifications({ telegramGroups, payload: resultsPayload });

  return;
};
