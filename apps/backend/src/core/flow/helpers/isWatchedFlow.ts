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

  const isUnWatchedByUser = flowVersion.Flow.EntityWatchedFlows.some(
    (watchedFlow) => watchedFlow.entityId === user.entityId && !watchedFlow.watched,
  );

  if (isUnWatchedByUser) return false;

  const isOwnedByWatchedGroup =
    flowVersion.Flow.OwnerGroup && flowVersion.Flow.OwnerGroup.UsersWatchedGroups.length > 0;

  const isWatchedByWatchedGroup = flowVersion.Flow.GroupsWatchedFlows.length > 0;

  const isWatchedByUser = flowVersion.Flow.EntityWatchedFlows.some(
    (watchedFlow) => watchedFlow.entityId === user.entityId && watchedFlow.watched,
  );

  if (isOwnedByWatchedGroup || isWatchedByWatchedGroup || isWatchedByUser) return true;
  else return false;
};
