import { GraphqlRequestContext } from "@graphql/context";
import { prisma } from "../../prisma/client";
import { ActionType, ProcessType } from "@prisma/client";

import { NewProcessArgs } from "frontend/src/graphql/generated/graphql";
import { newEvolveProcess } from "./newEvolveProcess";

import {
  createOptionSystem,
  createInputTemplateSet,
  createAction,
  createDecisionSystem,
  createRoleSet,
} from "./processHelpers";

export const newCustomProcess = async (
  {
    name,
    description,
    options,
    decision,
    inputs,
    roles,
    action,
    evolve,
  }: NewProcessArgs,
  context: GraphqlRequestContext,
) => {
  return await prisma.$transaction(async (transaction) => {
    let newActionRecord;
    const inputTemplateSetRecord = await createInputTemplateSet(
      { inputs, transaction },
      context,
    );

    const optionSystemRecord = await createOptionSystem(
      { options, transaction },
      context,
    );

    const decisionRecord = await createDecisionSystem(
      {
        decision,
        transaction,
      },
      context,
    );

    const roleSetRecord = await createRoleSet({ roles, transaction }, context);

    if (action?.webhook?.uri) {
      let webhookTriggerFilterOption =
        optionSystemRecord.defaultProcessOptionSet.options.find(
          (option) => option.value === action.optionTrigger,
        );

      newActionRecord = await createAction(
        {
          type: ActionType.customWebhook,
          action,
          filterOptionId: webhookTriggerFilterOption
            ? webhookTriggerFilterOption?.id
            : null,
          transaction,
        },
        context,
      );
    }

    const evolveProcessId = await newEvolveProcess(
      { evolve, transaction },
      context,
    );

    const processRecord = await transaction.process.create({
      include: {
        processVersions: true,
      },
      data: {
        type: ProcessType.Custom,
        processVersions: {
          create: [
            {
              name,
              description,
              expirationSeconds: decision.expirationSeconds,
              creatorId: context?.currentUser?.id,
              optionSystemId: optionSystemRecord.id,
              inputTemplateSetId: inputTemplateSetRecord.id,
              decisionSystemId: decisionRecord.id,
              roleSetId: roleSetRecord.id,
              actionId: newActionRecord?.id,
              approved: true,
              evolveProcessId,
            },
          ],
        },
      },
    });

    const finalProcessRecord = await transaction.process.update({
      where: {
        id: processRecord.id,
      },
      data: { currentProcessVersionId: processRecord.processVersions[0].id },
    });

    return finalProcessRecord.id;
  });
};
