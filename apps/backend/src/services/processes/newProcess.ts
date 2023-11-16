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
    inputs,
    absoluteDecision,
    percentageDecision,
    roles,
    action,
    editProcessId,
  }: NewProcessArgs,
  context: GraphqlRequestContext,
) => {
  return await prisma.$transaction(async (transaction) => {
    let newAction;
    const inputTemplateSet = await createInputTemplateSet(
      { inputs, transaction },
      context,
    );

    const optionSystem = await createOptionSystem(
      { options, transaction },
      context,
    );

    const decision = await createDecisionSystem(
      {
        absoluteDecision,
        percentageDecision,
        transaction,
      },
      context,
    );

    const roleSet = await createRoleSet({ roles, transaction }, context);

    if (action?.webhook?.uri) {
      let webhookTriggerFilterOption =
        optionSystem.defaultProcessOptionSet.options.find(
          (option) => option.value === action.optionTrigger,
        );

      newAction = await createAction(
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

    const process = await transaction.process.create({
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
              optionSystemId: optionSystem.id,
              inputTemplateSetId: inputTemplateSet.id,
              decisionSystemId: decision.id,
              roleSetId: roleSet.id,
              actionId: newAction?.id,
            },
          ],
        },
      },
    });

    const finalProcess = await transaction.process.update({
      where: {
        id: process.id,
      },
      data: { currentProcessVersionId: process.processVersions[0].id },
    });

    return finalProcess.id;
  });
};
