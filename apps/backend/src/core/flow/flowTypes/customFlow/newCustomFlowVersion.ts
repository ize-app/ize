import { Prisma } from "@prisma/client";

import { newFieldSet } from "@/core/fields/newFieldSet";
import { newPermission } from "@/core/permission/newPermission";
import { NewFlowArgs } from "@/graphql/generated/resolver-types";

import { StepPrismaType } from "../../flowPrismaTypes";
import { newStep } from "../../helpers/newStep";

export const newCustomFlowVersion = async ({
  transaction,
  flowArgs,
  evolveFlowId,
  flowId,
  active,
  // each flow references an evolve flow id, not an evolve flow version id
  // when we are evolving a flow and or it's corresponding evolve flow
  // we need to know whether the evolve flow itself has been evolved as part of that draft
  draftEvolveFlowVersionId,
}: {
  transaction: Prisma.TransactionClient;
  flowArgs: NewFlowArgs;
  flowId: string;
  evolveFlowId: string | null;
  // active refers to whether the flowVersion is intended to be live on creation
  active: boolean;
  draftEvolveFlowVersionId: string | null;
}): Promise<string> => {
  const triggerFieldsSet = await newFieldSet({
    fieldSetArgs: flowArgs.fieldSet,
    createdSteps: [],
    transaction,
  });
  const flowVersion = await transaction.flowVersion.create({
    data: {
      name: flowArgs.name,
      active,
      totalSteps: flowArgs.steps.length,
      reusable: flowArgs.reusable,
      publishedAt: !active ? null : new Date(),
      triggerPermissionsId: await newPermission({
        permission: flowArgs.trigger.permission,
        transaction,
      }),
      triggerFieldSetId: triggerFieldsSet?.id,
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

  return flowVersion.id;
};
