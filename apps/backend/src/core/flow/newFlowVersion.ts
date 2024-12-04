import { Prisma } from "@prisma/client";

import { newFieldSet } from "@/core/fields/newFieldSet";
import { newPermission } from "@/core/permission/newPermission";
import { FlowType, NewFlowArgs } from "@/graphql/generated/resolver-types";
import { ApolloServerErrorCode, GraphQLError } from "@graphql/errors";

import { StepPrismaType } from "./flowPrismaTypes";
import { newStep } from "./helpers/newStep";
import { validateFlowTypeArgs } from "./helpers/validateFlowTypeArgs";
import { newActionConfigSet } from "../action/newActionConfigSet";

export const newFlowVersion = async ({
  transaction,
  flowArgs,
  evolveFlowId,
  flowId,
  active,
  // each flow references an evolve flow id, not an evolve flow version id
  // when we are evolving a flow and or it's corresponding evolve flow
  // we need to know whether the evolve flow itself has been evolved as part of that draft
  draftEvolveFlowVersionId,
  type,
}: {
  transaction: Prisma.TransactionClient;
  flowArgs: NewFlowArgs;
  flowId: string;
  evolveFlowId: string | null;
  // active refers to whether the flowVersion is intended to be live on creation
  active: boolean;
  draftEvolveFlowVersionId: string | null;
  type: FlowType;
}): Promise<string> => {
  if (type !== flowArgs.type)
    throw new GraphQLError(`Type of flow does not match flow args, flowId ${flowId}`, {
      extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
    });

  validateFlowTypeArgs({ args: flowArgs });

  const flowVersion = await transaction.flowVersion.create({
    data: {
      id: flowArgs.flowVersionId,
      name: flowArgs.name,
      active,
      publishedAt: !active ? null : new Date(),
      draftEvolveFlowVersionId,
      evolveFlowId,
      // sets parent flow as using this newly created flow version
      FlowForCurrentVersion: !active
        ? undefined
        : {
            connect: {
              id: flowId,
            },
          },
      flowId: flowId,
    },
  });

  await newPermission({
    permission: flowArgs.trigger.permission,
    transaction,
    type: "trigger",
    flowVersionId: flowVersion.id,
  });

  await newFieldSet({
    type: "trigger",
    flowVersionId: flowVersion.id,
    fieldSetArgs: flowArgs.fieldSet,
    createdSteps: [],
    transaction,
  });

  const createdSteps: StepPrismaType[] = [];

  // executing in sequence because steps can reference previous steps
  for (let i = 0; i <= flowArgs.steps.length - 1; i++) {
    const step = flowArgs.steps[i];
    await newStep({
      args: step,
      transaction,
      flowVersionId: flowVersion.id,
      index: i,
      createdSteps,
    });
  }

  // creating actions after creating step because actions can reference future steps
  await Promise.all(
    flowArgs.steps.map(async (step, index) => {
      const nextStepId = flowArgs.steps?.[index + 1]?.stepId ?? null;
      await newActionConfigSet({
        stepArgs: step,
        nextStepId,
        flowVersionId: flowVersion.id,
        transaction,
      });
    }),
  );

  return flowVersion.id;
};
