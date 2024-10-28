import { resolveEntitySet } from "@/core/permission/hasWritePermission/resolveEntitySet";
import { requestInclude } from "@/core/request/requestPrismaTypes";
import { requestResolver } from "@/core/request/resolvers/requestResolver";
import { prisma } from "@/prisma/client";

import { sendTelegramNewStepMessage } from "./sendTelegramNewStepNotifications";
import { getGroupsToNotify } from "../getGroupsToNotifiy";

export const sendNewStepNotifications = async ({
  flowId,
  requestStepId,
}: {
  flowId: string;
  requestStepId: string;
}): Promise<void> => {
  try {
    // get groups that watch or own flow AND have notifications set up

    const groups = await getGroupsToNotify(flowId);

    if (groups.length === 0) {
      return;
    }

    const data = await prisma.request.findFirstOrThrow({
      where: { RequestSteps: { some: { id: requestStepId } } },
      include: requestInclude,
    });

    const request = await requestResolver({ req: data, context: {}, userGroupIds: [] });

    const stepIndex = data.RequestSteps.findIndex((rs) => rs.id === data.currentRequestStepId);
    const step = data.FlowVersion.Steps[stepIndex];
    const respondPermission = step.ResponseConfig?.ResponsePermissions;
    if (!respondPermission) return;

    const resolvedEntities = await resolveEntitySet({ permission: respondPermission });

    const telegramGroups = groups
      .map((group) => group.GroupCustom?.NotificationEntity?.Group?.GroupTelegramChat)
      .filter((tgGroup) => !!tgGroup);

    await sendTelegramNewStepMessage({
      telegramGroups,
      request,
      requestStepId,
      permissions: { resolvedEntities, anyone: respondPermission.anyone },
    });
  } catch (e) {
    // error sending group notifications shouldn't stop the request from being written
    console.log("Error sending group notifications: ", e);
  }
};
