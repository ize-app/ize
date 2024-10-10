import { UserPrismaType } from "@/core/user/userPrismaTypes";

import { FlowSummaryPrismaType } from "../flowPrismaTypes";

export const isWatchedFlowSummary = ({
  flowSummary,
  user,
}: {
  flowSummary: FlowSummaryPrismaType;
  user: UserPrismaType;
}) => {
  const isUnWatchedByUser = flowSummary.EntityWatchedFlows.some(
    (watchedFlow) => watchedFlow.entityId === user.entityId && !watchedFlow.watched,
  );

  if (isUnWatchedByUser) return false;

  const isOwnedByWatchedGroup =
    flowSummary.OwnerGroup && flowSummary.OwnerGroup.UsersWatchedGroups.length > 0;

  const isWatchedByWatchedGroup = flowSummary.GroupsWatchedFlows.length > 0;

  const isWatchedByUser = flowSummary.EntityWatchedFlows.some(
    (watchedFlow) => watchedFlow.entityId === user.entityId && watchedFlow.watched,
  );

  if (isOwnedByWatchedGroup || isWatchedByWatchedGroup || isWatchedByUser) return true;
  else return false;
};
