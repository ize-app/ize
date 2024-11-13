import { FlowType } from "@prisma/client";

import { createRequestPayload } from "@/core/request/createRequestPayload/createRequestPayload";
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

    // get all flow / request info
    // TODO: make it return only result from this step
    const resultsPayload = await createRequestPayload({ requestStepId, limitToCurrentStep: true });

    if (!resultsPayload) return;

    const telegramGroups = groups
      .map((group) => group.GroupCustom?.NotificationEntity?.Group?.GroupTelegramChat)
      .filter((tgGroup) => !!tgGroup);

    await sendTelegramResultsNotifications({
      telegramGroups,
      payload: resultsPayload,
      requestStepId,
    });

    return;
  } catch (e) {
    console.log("Error sendResultNotifications: ", e);
  }
};
