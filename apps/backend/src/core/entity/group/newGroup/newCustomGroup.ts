import { Prisma } from "@prisma/client";

import { createWebhook } from "@/core/action/webhook/createWebhook";
import { newGroupUpdateMembershipFlow } from "@/core/flow/groupUpdateMembership/newGroupUpdateMembershipFlow";
import { newGroupUpdateMetadataFlow } from "@/core/flow/groupUpdateMetadata/newGroupUpdateMetadataFlow";
import { newGroupWatchFlowFlow } from "@/core/flow/groupWatchFlows/newGroupWatchFlowFlow";
import { GraphqlRequestContext } from "@/graphql/context";
import { MutationNewCustomGroupArgs } from "@/graphql/generated/resolver-types";

import { newEntitySet } from "../../newEntitySet";
import { checkEntitiesForCustomGroups } from "../checkEntitiesForCustomGroups";

export const newCustomGroup = async ({
  context,
  args,
  transaction,
}: {
  context: GraphqlRequestContext;
  args: MutationNewCustomGroupArgs;
  transaction: Prisma.TransactionClient;
}): Promise<string> => {
  if (!context.currentUser) throw Error("ERROR Unauthenticated user");

  await checkEntitiesForCustomGroups({
    entityIds: args.inputs.members.map((entity) => entity.id),
    transaction,
  });

  const entitySetId = await newEntitySet({ entityArgs: args.inputs.members, transaction });

  const notificationWebhookId = args.inputs.notificationUri
    ? await createWebhook({
        uri: args.inputs.notificationUri,
        name: "Group notification",
        transaction,
      })
    : null;

  const customGroupEntity = await transaction.entity.create({
    select: {
      Group: true,
    },
    data: {
      Group: {
        create: {
          creatorId: context.currentUser?.id,
          GroupCustom: {
            create: {
              name: args.inputs.name,
              description: args.inputs.description,
              entitySetId,
              notificationWebhookId,
            },
          },
        },
      },
    },
  });

  await transaction.usersWatchedGroups.create({
    data: {
      userId: context.currentUser.id,
      groupId: customGroupEntity.Group?.id as string,
      watched: true,
    },
  });

  await newGroupUpdateMetadataFlow({
    transaction,
    context,
    groupEntityId: customGroupEntity.Group?.entityId as string,
    groupId: customGroupEntity.Group?.id as string,
  });

  await newGroupUpdateMembershipFlow({
    transaction,
    context,
    groupEntityId: customGroupEntity.Group?.entityId as string,
    groupId: customGroupEntity.Group?.id as string,
  });

  await newGroupWatchFlowFlow({
    transaction,
    context,
    groupEntityId: customGroupEntity.Group?.entityId as string,
    groupId: customGroupEntity.Group?.id as string,
  });

  return customGroupEntity.Group?.id as string;
};
