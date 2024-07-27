import { FlowSummaryPrismaType } from "../flowPrismaTypes";

export const isWatchedFlowSummary = ({
  flowSummary,
  userId,
}: {
  flowSummary: FlowSummaryPrismaType;
  userId: string;
}) => {

  const isUnWatchedByUser = flowSummary.UsersWatchedFlows.some(
    (watchedFlow) => watchedFlow.userId === userId && !watchedFlow.watched,
  );

  if (isUnWatchedByUser) return false;

  const isOwnedByWatchedGroup =
    flowSummary.OwnerGroup && flowSummary.OwnerGroup.UsersWatchedGroups.length > 0;

  const isWatchedByWatchedGroup = flowSummary.GroupsWatchedFlows.length > 0;

  const isWatchedByUser = flowSummary.UsersWatchedFlows.some(
    (watchedFlow) => watchedFlow.userId === userId && watchedFlow.watched,
  );

  if (isOwnedByWatchedGroup || isWatchedByWatchedGroup || isWatchedByUser) return true;
  else return false;
};
