import { groupResolver } from "@/core/entity/group/groupResolver";
import { FlowWatchers, Group } from "@/graphql/generated/resolver-types";

import { EntityWatchedFlowsPrismaType } from "../flowPrismaTypes";

export const watchingResolver = ({
  entityWatchedFlows,
}: {
  // list is either a user user/identity watched flows or a group watched flows
  entityWatchedFlows: EntityWatchedFlowsPrismaType[];
}): FlowWatchers => {
  let userUnwatched = false;
  let userWatched = false;
  const groups: Group[] = [];
  entityWatchedFlows.forEach((watchedFlow) => {
    if (watchedFlow.Entity.Group) groups.push(groupResolver(watchedFlow.Entity.Group));
    else {
      if (!watchedFlow.watched) {
        userUnwatched = true;
      } else {
        userWatched = true;
      }
    }
  });
  // if at least one of a user's identities has unwatched the flow, consider flow unwatched
  return { user: userUnwatched ? false : userWatched, groups };
};
