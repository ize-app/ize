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

  const flow = await transaction.flow.create({
    data: {
      type,
      reusable: args.reusable,
      creatorEntityId: entityId,
      groupId,
    },
  });

  console.log("args.reusable", args.reusable, "args.evolve", args.evolve);
  // only reusable flows get an evolve flow
  if (args.reusable) {
    // evolve flows evolve themselves
    if (type === FlowType.Evolve) evolveFlowId = flow.id;
    // if normal, resuable flow, create evolve flow
    else if (args.evolve)
      evolveFlowId = await newEvolveFlow({
        evolveArgs: args.evolve,

        transaction,
        entityContext,
      });
    else
      throw new GraphQLError("Reusable flows must include evolve flow arguments.", {
        extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
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
