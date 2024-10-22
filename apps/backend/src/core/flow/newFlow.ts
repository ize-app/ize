import { FlowType, Prisma } from "@prisma/client";

import { getUserEntities } from "@/core/entity/getUserEntities";
import { UserOrIdentityContextInterface } from "@/core/entity/UserOrIdentityContext";
import { NewFlowArgs } from "@/graphql/generated/resolver-types";
import { ApolloServerErrorCode, GraphQLError } from "@graphql/errors";

import { newEvolveFlow } from "./flowTypes/evolveFlow/newEvolveFlow";
import { newFlowVersion } from "./newFlowVersion";

export const newFlow = async ({
  type,
  args,
  entityContext,
  groupId,
  transaction,
}: {
  type: FlowType;
  args: NewFlowArgs;
  entityContext: UserOrIdentityContextInterface;
  transaction: Prisma.TransactionClient;
  groupId?: string;
}): Promise<string> => {
  const { entityId } = await getUserEntities({ entityContext });

  let evolveFlowId: string | null = null;

  // reusable flows need evolve flow arguments
  // unless the flow itself is an evolve flow, which evolves itself
  if (!args.evolve && args.reusable && type !== FlowType.Evolve)
    throw new GraphQLError("Reusable flows must include evolve flow arguments.", {
      extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
    });

  const flow = await transaction.flow.create({
    data: {
      type,
      reusable: args.reusable,
      creatorEntityId: entityId,
      groupId,
    },
  });

  if (args.evolve && args.reusable) {
    if (type === FlowType.Evolve) evolveFlowId = flow.id;
    else
      evolveFlowId = await newEvolveFlow({
        evolveArgs: args.evolve,

        transaction,
        entityContext,
      });
  }

  if (!args.reusable) {
    // non-reusable flows are triggered automatically after creation
    // creator of flow is only one with permission to trigger flow
    if (args.trigger) {
      args.trigger.permission = {
        anyone: false,
        entities: [{ id: entityId }],
      };
      args.fieldSet = { fields: [], locked: false };
    }
    // non-reusable flows can't be evolve
    args.evolve = undefined;
  }

  await newFlowVersion({
    transaction,
    flowArgs: args,
    flowId: flow.id,
    evolveFlowId,
    active: true,
    draftEvolveFlowVersionId: null,
  });

  return flow.id;
};
