import { GraphqlRequestContext } from "@graphql/context";
import { prisma } from "../../prisma/client";
import { ActionType, Prisma, ProcessType } from "@prisma/client";
import { EvolveArgs } from "@graphql/generated/resolver-types";

import {
  createOptionSystem,
  createInputTemplateSet,
  createAction,
  createDecisionSystem,
  createRoleSet,
} from "./processHelpers";

export const newEvolveProcess = async (
  {
    evolve,
    transaction = prisma,
  }: {
    evolve: EvolveArgs;
    transaction?: Prisma.TransactionClient;
  },
  context: GraphqlRequestContext,
) => {
  // TODO: import this from the FE
  const defaultInputRequestTitle = {
    name: "Request title",
    description: "Brief summary of request",
    required: true,
    type: "Text",
  };

  const inputTemplateSetRecord = await createInputTemplateSet(
    {
      inputs: [
        {
          name: "Request title",
          description: "Brief summary of request",
          required: true,
          //@ts-ignore
          type: "Text",
        },
        {
          name: "Process versions",
          description: "Array of process version IDs being proposed.",
          required: true,
          //@ts-ignore
          type: "StringArray",
        },
      ],
      transaction,
    },
    context,
  );

  // TODO: Remove ts-ignore. They are there because there's an issue importing enums from the frontend
  const optionSystemRecord = await createOptionSystem(
    {
      options: [
        //@ts-ignore
        { value: "✅", type: "Text" },
        //@ts-ignore
        { value: "❌", type: "Text" },
      ],
      transaction,
    },
    context,
  );

  const decisionRecord = await createDecisionSystem(
    {
      decision: evolve.decision,
      transaction,
    },
    context,
  );

  const roleSetRecord = await createRoleSet(
    { roles: evolve.roles, transaction },
    context,
  );

  const webhookTriggerFilterOption =
    optionSystemRecord.defaultProcessOptionSet.options.find(
      (option) => option.value === "✅",
    );

  const actionRecord = await createAction(
    {
      type: ActionType.evolveProcess,
      action: {},
      filterOptionId: webhookTriggerFilterOption
        ? webhookTriggerFilterOption?.id
        : null,
      transaction,
    },
    context,
  );

  const processRecord = await transaction.process.create({
    include: {
      processVersions: true,
    },
    data: {
      type: ProcessType.Evolve,
      processVersions: {
        create: [
          {
            name: "Evolve process",
            expirationSeconds: evolve.decision.expirationSeconds,
            creatorId: context?.currentUser?.id,
            optionSystemId: optionSystemRecord.id,
            inputTemplateSetId: inputTemplateSetRecord.id,
            decisionSystemId: decisionRecord.id,
            roleSetId: roleSetRecord.id,
            actionId: actionRecord?.id,
            approved: true,
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

  // evolve proccess's own evolve process is itself
  // in future versions, we'll allow an evolve process to be evolved by other evolve processes

  await transaction.processVersion.update({
    data: {
      evolveProcessId: finalProcessRecord.id,
    },
    where: {
      id: finalProcessRecord.currentProcessVersionId,
    },
  });

  return finalProcessRecord.id;
};
