import { entitySetInclude } from "@/core/entity/entityPrismaTypes";
import { entityResolver } from "@/core/entity/entityResolver";
import { GroupPrismaType, groupInclude } from "@/core/entity/group/groupPrismaTypes";
import { groupResolver } from "@/core/entity/group/groupResolver";
import { GraphqlRequestContext } from "@/graphql/context";
import { IzeGroup } from "@/graphql/generated/resolver-types";
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

  let isWatched = false;
  let isMember = false;

  if (context?.currentUser && getWatchAndPermissionStatus) {
    const watchRecord = await prisma.usersWatchedGroups.findUnique({
      where: {
        userId_groupId: {
          groupId,
          userId: context.currentUser.id,
        },
      },
    });

    const groupMember = await prisma.identityGroup.findFirst({
      where: {
        groupId,
        identityId: { in: context.currentUser.Identities.map((id) => id.id) },
      },
    });

    if (watchRecord) {
      isWatched = watchRecord.watched;
    }

    if (groupMember) {
      isMember = true;
    }
  }

  const membersRes = await prisma.groupCustom.findUnique({
    where: {
      groupId,
    },
    include: {
      MemberEntitySet: {
        include: entitySetInclude,
      },
    },
  });

  const members = [
    ...(membersRes?.MemberEntitySet.EntitySetEntities.map((entity) => {
      return entityResolver({
        entity: entity.Entity,
        userIdentityIds: context.currentUser?.Identities.map((id) => id.id) ?? [],
      });
    }) ?? []),
  ];

  return {
    group: groupResolver(group, isWatched, isMember),
    members,
    description: group.GroupCustom?.description,
    notificationUriPreview: group.GroupCustom?.Webhook?.uriPreview,
  };
};
