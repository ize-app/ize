import { GroupType, Prisma } from "@prisma/client";

import { newEvolveGroupFlow } from "@/core/flow/flowTypes/evolveGroup/newEvolveGroupFlow";
import { newGroupWatchFlowFlow } from "@/core/flow/flowTypes/groupWatchFlows/newGroupWatchFlowFlow";
import { confirmNotificationEntity } from "@/core/notification/confirmNotificationEntity";
import { GraphqlRequestContext } from "@/graphql/context";
import { MutationNewCustomGroupArgs } from "@/graphql/generated/resolver-types";

import { newEntitySet } from "../../newEntitySet";
import { upsertAllMemberEntitiesForIzeGroup } from "../../updateEntitiesGroups/upsertAllEntitiesForIzeGroup";
import { checkEntitiesForIzeGroups } from "../checkEntitiesForCustomGroups";

export const newIzeGroup = async ({
  context,
  args,
  transaction,
}: {
  context: GraphqlRequestContext;
  args: MutationNewCustomGroupArgs;
  transaction: Prisma.TransactionClient;
}): Promise<string> => {
  if (!context.currentUser) throw Error("ERROR Unauthenticated user");

  await checkEntitiesForIzeGroups({
    entityIds: args.inputs.members.map((entity) => entity.id),
    transaction,
  });

  const entitySetId = await newEntitySet({ entityArgs: args.inputs.members, transaction });

  if (args.inputs.notificationEntity) {
    await confirmNotificationEntity({ entityId: args.inputs.notificationEntity.id, context });
  }

  const izeGroupEntity = await transaction.entity.create({
    include: {
      Group: true,
    },
    data: {
      id: args.inputs.entityId,
      Group: {
        create: {
          creatorEntityId: context.currentUser?.entityId,
          type: GroupType.GroupIze,
          GroupIze: {
            create: {
              name: args.inputs.name,
              description: args.inputs.description,
              entitySetId,
              notificationEntityId: args.inputs.notificationEntity?.id,
            },
          },
        },
      },
    },
  });

  const evolveGroupFlowId = await newEvolveGroupFlow({
    transaction,
    context,
    groupEntityId: izeGroupEntity.Group?.entityId as string,
    groupId: izeGroupEntity.Group?.id as string,
    policy: args.inputs.flows.evolveGroup,
  });

  const watchFlowFlowId = await newGroupWatchFlowFlow({
    transaction,
    context,
    groupEntityId: izeGroupEntity.Group?.entityId as string,
    groupId: izeGroupEntity.Group?.id as string,
    policy: args.inputs.flows.watch,
  });

  // associates all direct members of group with the group
  await upsertAllMemberEntitiesForIzeGroup({
    entityIds: args.inputs.members.map((entity) => entity.id),
    groupId: izeGroupEntity.Group?.id as string,
    transaction,
  });

  // have group watch its own flows
  // maybe this is unnecessary
  await transaction.entityWatchedFlows.createMany({
    data: [
      { entityId: izeGroupEntity.id, flowId: evolveGroupFlowId, watched: true },
      { entityId: izeGroupEntity.id, flowId: watchFlowFlowId, watched: true },
    ],
  });

  return izeGroupEntity.Group?.id as string;
};
