import { FlowType } from "@prisma/client";

import { getRequestByRequestStepId } from "@/core/request/getRequestByRequestStepId";
import { prisma } from "@/prisma/client";

import { sendTelegramResultsNotifications } from "./sendTelegramResultsNotifications";
import { getGroupsToNotify } from "../getGroupsToNotifiy";

export const sendResultNotifications = async ({ requestStepId }: { requestStepId: string }) => {
  try {
    const req = await prisma.requestStep.findFirstOrThrow({
      where: {
        id: requestStepId,
      },
      include: {
        Request: {
          include: {
            FlowVersion: {
              include: { Flow: true },
            },
          },
        },
      },
    });

    // watch flow results are noisy, so going to ignore them for now
    if (req.Request.FlowVersion.Flow.type === FlowType.GroupWatchFlow) return;

    const groups = await getGroupsToNotify(req.Request.FlowVersion.flowId);

    if (groups.length === 0) {
      return;
    }

    const request = await getRequestByRequestStepId({ requestStepId });

    const telegramGroups = groups
      .map((group) => group.GroupIze?.NotificationEntity?.Group?.GroupTelegramChat)
      .filter((tgGroup) => !!tgGroup);

    await sendTelegramResultsNotifications({
      telegramGroups,
      request,
      requestStepId,
    });

    return;
  } catch (e) {
    console.log("Error sendResultNotifications: ", e);
  }
};
