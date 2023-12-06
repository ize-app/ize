import { prisma } from "../../prisma/client";
import { GraphqlRequestContext } from "@graphql/context";
import { ActionType, Prisma } from "@prisma/client";

import {
  ProcessOptionArgs,
  InputTemplateArgs,
  RoleArgs,
  DecisionArgs,
  ActionArgs,
} from "@graphql/generated/resolver-types";

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
    include: {
      defaultProcessOptionSet: {
        include: {
          options: true,
        },
      },
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
    type,
    action,
    filterOptionId,
    transaction = prisma,
  }: {
    type: ActionType;
    action: ActionArgs;
    filterOptionId: string | null;
    transaction?: Prisma.TransactionClient;
  },
  context: GraphqlRequestContext,
) => {
  if (action?.webhook) {
    return await transaction.action.create({
      data: {
        type: ActionType.customWebhook,
        optionId: filterOptionId,
        webhookAction: {
          create: {
            uri: action.webhook.uri,
          },
        },
      },
    });
  } else if (type === ActionType.evolveProcess) {
    return await transaction.action.create({
      data: {
        type: ActionType.evolveProcess,
        optionId: filterOptionId,
      },
    });
  }
};

export const createDecisionSystem = async (
  {
    decision,
    transaction = prisma,
  }: {
    decision: DecisionArgs;
    transaction?: Prisma.TransactionClient;
  },
  context: GraphqlRequestContext,
) => {
  if (decision.absoluteDecision)
    return await transaction.decisionSystem.create({
      data: {
        type: "Absolute",
        absoluteDecisionSystem: {
          create: decision.absoluteDecision,
        },
      },
    });
  else if (decision.percentageDecision) {
    return await transaction.decisionSystem.create({
      data: {
        type: "Percentage",
        percentageDecisionSystem: {
          create: decision.percentageDecision,
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
