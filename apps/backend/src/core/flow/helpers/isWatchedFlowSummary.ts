import { getUserEntityIds } from "@/core/user/getUserEntityIds";
import { UserPrismaType } from "@/core/user/userPrismaTypes";

import { FlowSummaryPrismaType } from "../flowPrismaTypes";

export const isWatchedFlowSummary = ({
  flowSummary,
  user,
}: {
  flowSummary: FlowSummaryPrismaType;
  user: UserPrismaType;
}) => {
  const entityIds = getUserEntityIds(user);

  // if at least one of a user's identities has unwatched the flow, consider flow unwatched
  const isUnWatchedByUser = flowSummary.EntityWatchedFlows.some((watchedFlow) =>
    entityIds.some((id) => id === watchedFlow.entityId && !watchedFlow.watched),
  );

  if (isUnWatchedByUser) return false;

  const isOwnedByWatchedGroup =
    flowSummary.OwnerGroup && flowSummary.OwnerGroup.EntityWatchedGroups.length > 0;

  const isWatchedByWatchedGroup = flowSummary.GroupsWatchedFlows.length > 0;

  // if at least one of a user's identities has unwatched the flow, consider flow watched
  const isWatchedByUser = flowSummary.EntityWatchedFlows.some((watchedFlow) =>
    entityIds.some((id) => id === watchedFlow.entityId && watchedFlow.watched),
  );

  if (isOwnedByWatchedGroup || isWatchedByWatchedGroup || isWatchedByUser) return true;
  else return false;
};
