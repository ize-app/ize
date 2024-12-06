import { GraphqlRequestContext } from "@/graphql/context";
import { FlowType, IzeGroup } from "@/graphql/generated/resolver-types";

import { IzeGroupPrismaType } from "./groupPrismaTypes";
import { groupResolver } from "./groupResolver";
import { entityResolver } from "../entityResolver";

export const izeGroupResolver = ({
  izeGroup,
  context,
}: {
  izeGroup: IzeGroupPrismaType;
  context: GraphqlRequestContext;
}): IzeGroup => {
  return {
    groupId: izeGroup.groupId,
    group: groupResolver(izeGroup.group),
    members: [
      ...(izeGroup?.MemberEntitySet.EntitySetEntities.map((entity) => {
        return entityResolver({
          entity: entity.Entity,
          userIdentityIds: context.currentUser?.Identities.map((id) => id.id) ?? [],
        });
      }) ?? []),
    ],
    description: izeGroup.description,
    notificationEntity: izeGroup.NotificationEntity
      ? entityResolver({
          entity: izeGroup.NotificationEntity,
          userIdentityIds: context.currentUser?.Identities.map((id) => id.id) ?? [],
        })
      : null,
    evolveGroupFlowId:
      izeGroup.group.OwnedFlows.find((f) => f.type === FlowType.EvolveGroup)?.id ?? null,
    isWatched: izeGroup.group.EntityWatchedGroups.length > 0,
    isMember: izeGroup.group.EntitiesInGroup.length > 0,
  };
};
