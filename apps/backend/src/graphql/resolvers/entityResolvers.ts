import { entitySetInclude } from "@/core/entity/entityPrismaTypes";
import { entityResolver } from "@/core/entity/entityResolver";
import { getGroupsOfUser } from "@/core/entity/group/getGroupsOfUser";
import { GroupPrismaType, groupInclude } from "@/core/entity/group/groupPrismaTypes";
import { groupResolver } from "@/core/entity/group/groupResolver";
import { newCustomGroup as newCustomGroupService } from "@/core/entity/group/newGroup/newCustomGroup";
import { newEntities as newEntitiesService } from "@/core/entity/newEntities";
import { prisma } from "@/prisma/client";
import { GraphqlRequestContext } from "@graphql/context";
import {
  Entity,
  Group,
  IzeGroup,
  MutationNewCustomGroupArgs,
  MutationNewEntitiesArgs,
  MutationResolvers,
  MutationTestNotificationWebhookArgs,
  QueryGroupArgs,
  QueryGroupsForCurrentUserArgs,
  QueryResolvers,
} from "@graphql/generated/resolver-types";
import { testNotificationWebhook as testNotificationWebhookService } from "@/core/notification/testNotificationWebhook";

const newEntities: MutationResolvers["newEntities"] = async (
  root: unknown,
  args: MutationNewEntitiesArgs,
  context: GraphqlRequestContext,
): Promise<Entity[]> => {
  return await newEntitiesService(args, context);
};

const group: QueryResolvers["group"] = async (
  root: unknown,
  args: QueryGroupArgs,
  context: GraphqlRequestContext,
): Promise<IzeGroup> => {
  const group: GroupPrismaType = await prisma.group.findFirstOrThrow({
    include: groupInclude,
    where: { id: args.id },
  });

  let isWatched = false;
  let isMember = false;

  if (context.currentUser) {
    const watchRecord = await prisma.usersWatchedGroups.findUnique({
      where: {
        userId_groupId: {
          groupId: args.id,
          userId: context.currentUser.id,
        },
      },
    });

    const groupMember = await prisma.identityGroup.findFirst({
      where: {
        groupId: args.id,
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
      groupId: args.id,
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

export const groupsForCurrentUser: QueryResolvers["groupsForCurrentUser"] = async (
  root: unknown,
  args: QueryGroupsForCurrentUserArgs,
  context: GraphqlRequestContext,
): Promise<Group[]> => {
  return await getGroupsOfUser({ args, context });
};

export const newCustomGroup: MutationResolvers["newCustomGroup"] = async (
  root: unknown,
  args: MutationNewCustomGroupArgs,
  context: GraphqlRequestContext,
): Promise<string> => {
  return await prisma.$transaction(async (transaction) => {
    return await newCustomGroupService({ args, context, transaction });
  });
};

export const testNotificationWebhook: MutationResolvers["testNotificationWebhook"] = async (
  root: unknown,
  args: MutationTestNotificationWebhookArgs,
  context: GraphqlRequestContext,
): Promise<boolean> => {
  return testNotificationWebhookService({ args, context });
};

export const entityMutations = {
  newCustomGroup,
  newEntities,
  testNotificationWebhook,
};

export const entityQueries = {
  group,
  groupsForCurrentUser,
};
