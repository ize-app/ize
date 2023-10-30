import { prisma } from "../../prisma/client";
import { GraphqlRequestContext } from "@graphql/context";
import { Prisma, PrismaClient } from "@prisma/client";

export interface CreateOptionArgs
  extends Omit<
    Prisma.OptionCreateManyInput,
    "id" | "created_at" | "position"
  > {}

export interface CreateInputTemplateArgs
  extends Omit<
    Prisma.InputTemplateCreateManyInput,
    "id" | "created_at" | "position"
  > {}

export interface CreateAbsoluteDecisionArgs
  extends Omit<Prisma.AbsoluteDecisionSystemCreateInput, "id" | "created_at"> {
  type: "Absolute";
}

export interface CreatePercentageDecisionArgs
  extends Omit<
    Prisma.PercentageDecisionSystemCreateInput,
    "id" | "created_at"
  > {
  type: "Percentage";
}

export interface CreateRoleUserArgs
  extends Omit<Prisma.RoleUserCreateInput, "id" | "created_at"> {
  agentType: "User";
}

export interface CreateRoleGroupArgs
  extends Omit<Prisma.RoleGroupCreateInput, "id" | "created_at"> {
  agentType: "Group";
}

export const createOptionSystem = async (
  {
    options,
    transaction = prisma,
  }: {
    options: CreateOptionArgs[];
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
    inputs: CreateInputTemplateArgs[];
    transaction?: Prisma.TransactionClient;
  },
  context: GraphqlRequestContext,
) =>
  await transaction.inputTemplateSet.create({
    data: {
      inputTemplates: {
        create: inputs.map((input, index) => ({ ...input, position: index })),
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
    absoluteDecision?: CreateAbsoluteDecisionArgs;
    percentageDecision?: CreatePercentageDecisionArgs;
    transaction?: Prisma.TransactionClient;
  },
  context: GraphqlRequestContext,
) => {
  if (absoluteDecision)
    return await transaction.decisionSystem.create({
      data: {
        type: absoluteDecision.type,
        absoluteDecisionSystem: {
          create: absoluteDecision,
        },
      },
    });
  else if (percentageDecision) {
    return await transaction.decisionSystem.create({
      data: {
        type: percentageDecision.type,
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
    roles: (CreateRoleUserArgs | CreateRoleGroupArgs)[];
    transaction?: Prisma.TransactionClient;
  },
  context: GraphqlRequestContext,
) => {
  return await transaction.roleSet.create({
    data: {
      roleGroups: {
        create: roles.filter(
          (roles) => roles.agentType === "Group",
        ) as CreateRoleGroupArgs[],
      },
      roleUsers: {
        create: roles.filter(
          (roles) => roles.agentType === "User",
        ) as CreateRoleUserArgs[],
      },
    },
  });
};
