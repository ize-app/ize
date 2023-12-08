import { GraphqlRequestContext } from "@graphql/context";
import { prisma } from "../../prisma/client";
import { ActionType, ProcessType } from "@prisma/client";

import { NewProcessArgs } from "@graphql/generated/resolver-types";
import { newEvolveProcess } from "./newEvolveProcess";

import {
  createOptionSystem,
  createInputTemplateSet,
  createAction,
  createDecisionSystem,
  createRoleSet,
} from "./processHelpers";

export const newCustomProcess = async (
  { name, description, options, decision, inputs, roles, action, evolve }: NewProcessArgs,
  context: GraphqlRequestContext,
) => {
  return await prisma.$transaction(async (transaction) => {
    if (!context.currentUser) throw Error("ERROR Unauthenticated user");

    let newActionRecord;
    const inputTemplateSetRecord = await createInputTemplateSet({ inputs, transaction });

    const optionSystemRecord = await createOptionSystem({ options, transaction });

    const decisionRecord = await createDecisionSystem({
      decision,
      transaction,
    });

    const roleSetRecord = await createRoleSet({ roles, transaction });

    if (action?.webhook?.uri) {
      const webhookTriggerFilterOption = optionSystemRecord?.defaultProcessOptionSet?.options.find(
        (option) => option.value === action.optionTrigger,
      );

      newActionRecord = await createAction({
        type: ActionType.customWebhook,
        action,
        filterOptionId: webhookTriggerFilterOption ? webhookTriggerFilterOption?.id : null,
        transaction,
      });
    }

    const evolveProcessId = await newEvolveProcess({ evolve, transaction }, context);

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

    // add process parent ID to evolve process
    await transaction.processVersion.updateMany({
      data: {
        parentProcessId: processRecord.id,
      },
      where: {
        process: {
          id: evolveProcessId,
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
