import { getUserEntityIds } from "@/core/user/getUserEntityIds";
import { UserPrismaType } from "@/core/user/userPrismaTypes";

import { FlowVersionPrismaType } from "../flowPrismaTypes";

export const isWatchedFlow = ({
  flowVersion,
  user,
}: {
  flowVersion: FlowVersionPrismaType;
  user: UserPrismaType | undefined | null;
}) => {
  if (!user) return false;
  const entityIds = getUserEntityIds(user);

  // if at least one of a user's identities has unwatched the flow, consider flow unwatched
  const isUnWatchedByUser = flowVersion.Flow.EntityWatchedFlows.some((watchedFlow) =>
    entityIds.some((id) => id === watchedFlow.entityId && !watchedFlow.watched),
  );

  if (isUnWatchedByUser) return false;

  const isOwnedByWatchedGroup =
    flowVersion.Flow.OwnerGroup && flowVersion.Flow.OwnerGroup.EntityWatchedGroups.length > 0;

  const isWatchedByWatchedGroup = flowVersion.Flow.GroupsWatchedFlows.length > 0;

  // if at least one of a users identities has watched the flow, consider flow watched
  const isWatchedByUser = flowVersion.Flow.EntityWatchedFlows.some((watchedFlow) =>
    entityIds.some((id) => id === watchedFlow.entityId && watchedFlow.watched),
  );

  if (isOwnedByWatchedGroup || isWatchedByWatchedGroup || isWatchedByUser) return true;
  else return false;
};
