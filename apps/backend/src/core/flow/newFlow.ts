import { FlowType, Prisma } from "@prisma/client";

import { getUserEntities } from "@/core/entity/getUserEntities";
import { UserOrIdentityContextInterface } from "@/core/entity/UserOrIdentityContext";
import { NewFlowWithEvolveArgs } from "@/graphql/generated/resolver-types";
import { ApolloServerErrorCode, GraphQLError } from "@graphql/errors";

import { newFlowVersion } from "./newFlowVersion";

export const newFlow = async ({
  type,
  args,
  entityContext,
  groupId,
  transaction,
}: {
  type: FlowType;
  args: NewFlowWithEvolveArgs;
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

  // only reusable flows get an evolve flow
  if (args.reusable) {
    // evolve flows evolve themselves
    if (type === FlowType.Evolve) evolveFlowId = flow.id;
    // if normal, resuable flow, create evolve flow
    else if (args.evolve)
      evolveFlowId = await newFlow({
        // evolveArgs: args.evolve,
        args: {
          flow: args.evolve,
          reusable: true,
        },
        type: FlowType.Evolve,
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
    if (args.flow.trigger) {
      args.flow.trigger.permission = {
        anyone: false,
        entities: [{ id: entityId }],
      };
      args.flow.fieldSet = { fields: [], locked: false };
    }
    // non-reusable flows can't be evolve
    args.evolve = undefined;
  }

  await newFlowVersion({
    transaction,
    flowArgs: args.flow,
    flowId: flow.id,
    evolveFlowId,
    active: true,
    draftEvolveFlowVersionId: null,
  });

  return flow.id;
};
