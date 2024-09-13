import { GroupType, Prisma } from "@prisma/client";

import { newEvolveGroupFlow } from "@/core/flow/evolveGroup/newEvolveGroupFlow";
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

  // const notificationWebhookId = args.inputs.notificationUri
  //   ? await createWebhook({
  //       args: {
  //         uri: args.inputs.notificationUri,
  //         name: "Group notification",
  //         webhookId: undefined,
  //       },

  //       transaction,
  //     })
  //   : null;

  const customGroupEntity = await transaction.entity.create({
    select: {
      Group: true,
    },
    data: {
      Group: {
        create: {
          creatorId: context.currentUser?.id,
          type: GroupType.GroupCustom,
          GroupCustom: {
            create: {
              name: args.inputs.name,
              description: args.inputs.description,
              entitySetId,
            },
          },
        },
      },
    },
  });

  // await newGroupUpdateMetadataFlow({
  //   transaction,
  //   context,
  //   groupEntityId: customGroupEntity.Group?.entityId as string,
  //   groupId: customGroupEntity.Group?.id as string,
  // });

  // await newGroupUpdateMembershipFlow({
  //   transaction,
  //   context,
  //   groupEntityId: customGroupEntity.Group?.entityId as string,
  //   groupId: customGroupEntity.Group?.id as string,
  // });

  await newEvolveGroupFlow({
    transaction,
    context,
    groupEntityId: customGroupEntity.Group?.entityId as string,
    groupId: customGroupEntity.Group?.id as string,
    policy: args.inputs.flows.evolveGroup,
  });

  await newGroupWatchFlowFlow({
    transaction,
    context,
    groupEntityId: customGroupEntity.Group?.entityId as string,
    groupId: customGroupEntity.Group?.id as string,
    policy: args.inputs.flows.watch,
  });

  // await newGroupUpdateNotificationsFlow({
  //   transaction,
  //   context,
  //   groupEntityId: customGroupEntity.Group?.entityId as string,
  //   groupId: customGroupEntity.Group?.id as string,
  // });

  return customGroupEntity.Group?.id as string;
};
