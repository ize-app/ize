import { prisma } from "../../prisma/client";
import { MutationNewEvolveRequestArgs } from "@graphql/generated/resolver-types";
import { GraphqlRequestContext } from "../../graphql/context";
import { newCustomFlowVersion } from "../flow/helpers/newCustomFlowVersion";
import { newEvolveFlowVersion } from "../flow/helpers/newEvolveFlowVersion";

// creates a new request for a flow, starting with the request's first step
// validates/creates request fields and request defined options
export const newEvolveRequest = async ({
  args,
  context,
}: {
  args: MutationNewEvolveRequestArgs;
  context: GraphqlRequestContext;
}): Promise<string> => {
  return await prisma.$transaction(async (transaction) => {
    const {
      request: { proposedFlow, flowId },
    } = args;

    const flow = await transaction.flow.findUniqueOrThrow({
      include: { CurrentFlowVersion: true },
      where: { id: flowId },
    });

    // console.log("proposed flow", proposedFlow);
    // console.log("current flow", currentFlow);

    // create new custom flow version
    await newCustomFlowVersion({
      transaction,
      flowArgs: proposedFlow,
      flowId: flow.id,
      evolveFlowId: flow.CurrentFlowVersion?.evolveFlowId ?? null,
      draft: true,
    });

    // create new evolve flow version
    if (flow.CurrentFlowVersion?.evolveFlowId) {
      await newEvolveFlowVersion({
        transaction,
        flowId: flow.CurrentFlowVersion?.evolveFlowId,
        evolveArgs: proposedFlow.evolve,
        draft: true,
      });
    }
    return "";
  });
};
