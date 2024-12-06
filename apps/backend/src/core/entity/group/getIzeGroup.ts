import { EntityPrismaType, entityInclude, entitySetInclude } from "@/core/entity/entityPrismaTypes";
import { entityResolver } from "@/core/entity/entityResolver";
import { GroupPrismaType, groupInclude } from "@/core/entity/group/groupPrismaTypes";
import { groupResolver } from "@/core/entity/group/groupResolver";
import { GraphqlRequestContext } from "@/graphql/context";
import { FlowType, IzeGroup } from "@/graphql/generated/resolver-types";
import { prisma } from "@/prisma/client";

export const getIzeGroup = async ({
  groupId,
  context,
  getWatchAndPermissionStatus,
}: {
  groupId: string;
  context: GraphqlRequestContext;
  getWatchAndPermissionStatus: boolean;
}): Promise<IzeGroup> => {
  const group: GroupPrismaType = await prisma.group.findFirstOrThrow({
    include: groupInclude,
    where: { id: groupId },
  });

  let notificationEntity: EntityPrismaType | null = null;
  let isWatched = false;
  let isMember = false;
  console.log("groupid", groupId);

  if (context?.currentUser && getWatchAndPermissionStatus) {
    const watchRecord = await prisma.entityWatchedGroups.findFirst({
      where: {
        entityId: { in: context.userEntityIds },
        groupId,
        watched: true,
      },
    });

    const groupMember = await prisma.entityGroup.findFirst({
      where: {
        groupId,
        entityId: { in: context.userEntityIds },
      },
    });

    if (watchRecord) {
      isWatched = watchRecord.watched;
    }

    if (groupMember) {
      isMember = true;
    }
  }

  const izeGroup = await prisma.groupIze.findUnique({
    where: {
      groupId,
    },
    include: {
      MemberEntitySet: {
        include: entitySetInclude,
      },
      group: {
        include: {
          OwnedFlows: true,
        },
      },
    },
  });

  const evolveFlow = (izeGroup?.group.OwnedFlows ?? []).find(
    (flow) => flow.type === FlowType.EvolveGroup,
  );

  const members = [
    ...(izeGroup?.MemberEntitySet.EntitySetEntities.map((entity) => {
      return entityResolver({
        entity: entity.Entity,
        userIdentityIds: context.currentUser?.Identities.map((id) => id.id) ?? [],
      });
    }) ?? []),
  ];

  if (group.GroupIze?.notificationEntityId) {
    notificationEntity = await prisma.entity.findFirst({
      where: {
        id: group.GroupIze?.notificationEntityId ?? undefined,
      },
      include: entityInclude,
    });
  }

  return {
    group: groupResolver(group, isWatched, isMember),
    members,
    description: group.GroupIze?.description,
    notificationEntity: notificationEntity
      ? entityResolver({
          entity: notificationEntity,
          userIdentityIds: context.currentUser?.Identities.map((id) => id.id) ?? [],
        })
      : null,
    evolveGroupFlowId: evolveFlow?.id ?? null,
  };
};
