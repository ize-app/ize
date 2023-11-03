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
    webhookUri,
    absoluteDecision,
    percentageDecision,
    roles,
    editProcessId,
  }: NewProcessArgs,
  context: GraphqlRequestContext,
) => {
  return await prisma.$transaction(async (transaction) => {
    // TODO: replace placeholders

    let action;

    if (webhookUri) {
      action = await createAction({ webhookUri, transaction }, context);
    }

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
              actionId: action?.id,
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
