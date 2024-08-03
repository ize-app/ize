import { FlowVersionPrismaType } from "../flowPrismaTypes";

export const isWatchedFlow = ({
  flowVersion,
  userId,
}: {
  flowVersion: FlowVersionPrismaType;
  userId: string | undefined;
}) => {
  if (!userId) return false;

  const isUnWatchedByUser = flowVersion.Flow.UsersWatchedFlows.some(
    (watchedFlow) => watchedFlow.userId === userId && !watchedFlow.watched,
  );

  if (isUnWatchedByUser) return false;

  const isOwnedByWatchedGroup =
    flowVersion.Flow.OwnerGroup && flowVersion.Flow.OwnerGroup.UsersWatchedGroups.length > 0;

  const isWatchedByWatchedGroup = flowVersion.Flow.GroupsWatchedFlows.length > 0;

  const isWatchedByUser = flowVersion.Flow.UsersWatchedFlows.some(
    (watchedFlow) => watchedFlow.userId === userId && watchedFlow.watched,
  );

  if (isOwnedByWatchedGroup || isWatchedByWatchedGroup || isWatchedByUser) return true;
  else return false;
};
