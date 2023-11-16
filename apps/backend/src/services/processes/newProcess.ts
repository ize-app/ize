import { GraphqlRequestContext } from "@graphql/context";
import { prisma } from "../../prisma/client";
import { Prisma, PrismaClient } from "@prisma/client";

import { NewProcessArgs } from "frontend/src/graphql/generated/graphql";

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
    expirationSeconds,
    options,
    decision,
    inputs,
    roles,
    action,
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
          webhookUri: action.webhook.uri,
          filterOptionId: webhookTriggerFilterOption
            ? webhookTriggerFilterOption?.id
            : null,
          transaction,
        },
        context,
      );
    }

    const processRecord = await transaction.process.create({
      include: {
        processVersions: true,
      },
      data: {
        type: "Custom",
        processVersions: {
          create: [
            {
              name,
              description,
              expirationSeconds,
              // TODO: Why is this error not happening on the other file
              creatorId: context?.currentUser?.id as string,
              optionSystemId: optionSystemRecord.id,
              inputTemplateSetId: inputTemplateSetRecord.id,
              decisionSystemId: decisionRecord.id,
              roleSetId: roleSetRecord.id,
              actionId: newActionRecord?.id,
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
