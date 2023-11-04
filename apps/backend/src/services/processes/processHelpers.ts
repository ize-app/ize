import { prisma } from "../../prisma/client";
import { GraphqlRequestContext } from "@graphql/context";
import { Prisma } from "@prisma/client";

import {
  ProcessOptionArgs,
  InputTemplateArgs,
  AbsoluteDecisionArgs,
  PercentageDecisionArgs,
  RoleArgs,
} from "frontend/src/graphql/generated/graphql";

export const createOptionSystem = async (
  {
    options,
    transaction = prisma,
  }: {
    options: ProcessOptionArgs[];
    transaction?: Prisma.TransactionClient;
  },
  context: GraphqlRequestContext,
) => {
  const optionSet = await transaction.optionSet.create({
    data: {
      options: {
        create: options.map((option, index) => ({
          ...option,
          position: index,
        })),
      },
    },
  });

  const optionSystem = await transaction.optionSystem.create({
    data: {
      dataType: "Text",
      defaultProcessOptionSetId: optionSet.id,
    },
  });

  return optionSystem;
};

export const createInputTemplateSet = async (
  {
    inputs,
    transaction = prisma,
  }: {
    inputs: InputTemplateArgs[];
    transaction?: Prisma.TransactionClient;
  },
  context: GraphqlRequestContext,
) =>
  await transaction.inputTemplateSet.create({
    data: {
      inputTemplates: {
        create: inputs.map((input, index) => ({
          ...input,
          position: index,
        })),
      },
    },
  });

export const createAction = async (
  {
    webhookUri,
    transaction = prisma,
  }: {
    webhookUri: string;
    transaction?: Prisma.TransactionClient;
  },
  context: GraphqlRequestContext,
) => {
  const customWebhookConfig = JSON.stringify({ uri: webhookUri });

  return await transaction.action.create({
    data: { type: "customWebhook", config: customWebhookConfig },
  });
};

export const createDecisionSystem = async (
  {
    absoluteDecision,
    percentageDecision,
    transaction = prisma,
  }: {
    absoluteDecision?: AbsoluteDecisionArgs;
    percentageDecision?: PercentageDecisionArgs;
    transaction?: Prisma.TransactionClient;
  },
  context: GraphqlRequestContext,
) => {
  if (absoluteDecision)
    return await transaction.decisionSystem.create({
      data: {
        type: "Absolute",
        absoluteDecisionSystem: {
          create: absoluteDecision,
        },
      },
    });
  else if (percentageDecision) {
    return await transaction.decisionSystem.create({
      data: {
        type: "Percentage",
        percentageDecisionSystem: {
          create: percentageDecision,
        },
      },
    });
  } else throw Error("No decision system provided");
};

export const createRoleSet = async (
  {
    roles,
    transaction = prisma,
  }: {
    roles: RoleArgs[];
    transaction?: Prisma.TransactionClient;
  },
  context: GraphqlRequestContext,
) => {
  return await transaction.roleSet.create({
    data: {
      roleGroups: {
        create: roles
          .filter((roles) => roles.agentType === "Group")
          .map((role) => ({ groupId: role.id, type: role.type })),
      },
      roleUsers: {
        create: roles
          .filter((roles) => roles.agentType === "User")
          .map((role) => ({ userId: role.id, type: role.type })),
      },
    },
  });
};
