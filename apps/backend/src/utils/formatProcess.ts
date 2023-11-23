import { Prisma } from "@prisma/client";
import { groupInclude, formatGroup } from "backend/src/utils/formatGroup";
import { userInclude, formatUser } from "backend/src/utils/formatUser";

import {
  Action,
  Process,
  ProcessOption,
  OptionType,
  InputTemplate,
  InputDataType,
  AbsoluteDecision,
  PercentageDecision,
  Roles,
} from "frontend/src/graphql/generated/graphql";

export interface ProcessVersion
  extends Omit<Process, "id" | "createdAt" | "currentProcessVersionId"> {}

export const roleSetInclude = Prisma.validator<Prisma.RoleSetInclude>()({
  roleGroups: {
    include: {
      group: {
        include: groupInclude,
      },
    },
  },
  roleUsers: {
    include: {
      user: {
        include: userInclude,
      },
    },
  },
});

type RoleSetPrismaType = Prisma.RoleSetGetPayload<{
  include: typeof roleSetInclude;
}>;

const inputTemplateInclude = Prisma.validator<Prisma.InputTemplateInclude>()(
  {},
);

type InputTemplatePrismaType = Prisma.InputTemplateGetPayload<{
  include: typeof inputTemplateInclude;
}>;

export const optionSystemInclude =
  Prisma.validator<Prisma.OptionSystemInclude>()({
    defaultProcessOptionSet: {
      include: {
        options: true,
      },
    },
  });

type OptionSystemPrismaType = Prisma.OptionSystemGetPayload<{
  include: typeof optionSystemInclude;
}>;

const decisionSystemInclude = Prisma.validator<Prisma.DecisionSystemInclude>()({
  absoluteDecisionSystem: true,
  percentageDecisionSystem: true,
});

type DecisionSystemPrismaType = Prisma.DecisionSystemGetPayload<{
  include: typeof decisionSystemInclude;
}>;

const actionInclude = Prisma.validator<Prisma.ActionInclude>()({
  webhookAction: true,
});

type ActionPrismaType = Prisma.ActionGetPayload<{
  include: typeof actionInclude;
}>;

export const processVersionInclude =
  Prisma.validator<Prisma.ProcessVersionInclude>()({
    creator: {
      include: userInclude,
    },
    process: true,
    optionSystem: {
      include: optionSystemInclude,
    },
    inputTemplateSet: {
      include: {
        inputTemplates: inputTemplateInclude,
      },
    },
    decisionSystem: {
      include: decisionSystemInclude,
    },
    action: {
      include: actionInclude,
    },
    roleSet: {
      include: roleSetInclude,
    },
  });

type ProcessVersionPrismaType = Prisma.ProcessVersionGetPayload<{
  include: typeof processVersionInclude;
}>;

// creating a seperate "editProcessInclude" to avoid infinite recursion since edit process can refer to itself
export const editProcessInclude = Prisma.validator<Prisma.ProcessInclude>()({
  currentProcessVersion: {
    include: { ...processVersionInclude },
  },
});

export const processInclude = Prisma.validator<Prisma.ProcessInclude>()({
  currentProcessVersion: {
    include: {
      ...processVersionInclude,
      evolveProcess: {
        include: editProcessInclude,
      },
    },
  },
});

type ProcessPrismaType = Prisma.ProcessGetPayload<{
  include: typeof processInclude;
}>;

type EditProcessPrismaType = Prisma.ProcessGetPayload<{
  include: typeof editProcessInclude;
}>;

interface customActionConfig {
  uri: string;
}

export const formatProcess = (processData: ProcessPrismaType): Process => {
  const { currentProcessVersion } = processData;

  const formattedProcessVersion = formatProcessVersion(currentProcessVersion);

  const data = {
    id: processData.id,
    currentProcessVersionId: currentProcessVersion?.id,
    createdAt: processData.createdAt.toString(),
    evolve: formatEvolveProcess(currentProcessVersion.evolveProcess),
    ...formattedProcessVersion,
  };
  return data;
};

export const formatEvolveProcess = (
  processData: EditProcessPrismaType,
): Process => {
  const { currentProcessVersion } = processData;

  const formattedProcessVersion = formatProcessVersion(currentProcessVersion);

  const data = {
    id: processData.id,
    currentProcessVersionId: currentProcessVersion?.id,
    createdAt: processData.createdAt.toString(),
    ...formattedProcessVersion,
  };
  return data;
};

export const formatProcessVersion = (
  processVersion: ProcessVersionPrismaType,
): ProcessVersion => {
  const {
    creator,
    optionSystem,
    inputTemplateSet,
    decisionSystem,
    action,
    roleSet,
  } = processVersion;

  const options = formatOptions(optionSystem);

  const data: ProcessVersion = {
    name: processVersion.name,
    description: processVersion.description,
    expirationSeconds: processVersion.expirationSeconds,
    creator: formatUser(creator),
    options: options,
    decisionSystem: formatDecisionSystem(decisionSystem),
    inputs: inputTemplateSet.inputTemplates
      .sort((a, b) => a.position - b.position)
      .map(
        (input): InputTemplate => ({
          id: input.id,
          name: input.name,
          description: input.description,
          required: input.required,
          type: input.type as InputDataType,
        }),
      ),
    action: action ? formatAction(action, options) : undefined,
    roles: formatRoles(roleSet),
  };

  return data;
};

const formatRoles = (roleSet: RoleSetPrismaType): Roles => {
  const roles: Roles = { request: [], respond: [], edit: undefined };
  roleSet.roleGroups.forEach((role) => {
    if (role.type === "Request") roles.request.push(formatGroup(role.group));
    else if (role.type === "Respond")
      roles.respond.push(formatGroup(role.group));
  });

  roleSet.roleUsers.forEach((role) => {
    if (role.type === "Request") roles.request.push(formatUser(role.user));
    else if (role.type === "Respond") roles.respond.push(formatUser(role.user));
  });

  return roles;
};

export const formatDecisionSystem = (
  decisionSystem: DecisionSystemPrismaType,
): AbsoluteDecision | PercentageDecision => {
  if (decisionSystem.type === "Absolute")
    return {
      __typename: "AbsoluteDecision",
      threshold: decisionSystem.absoluteDecisionSystem.threshold,
    };
  else if (decisionSystem.type === "Percentage")
    return {
      __typename: "PercentageDecision",
      quorum: decisionSystem.absoluteDecisionSystem.threshold,
      percentage: decisionSystem.percentageDecisionSystem.percentage,
    };
};

export const formatOptions = (
  optionSystem: OptionSystemPrismaType,
): ProcessOption[] =>
  optionSystem.defaultProcessOptionSet.options
    .sort((a, b) => a.position - b.position)
    .map(
      (option): ProcessOption => ({
        id: option.id,
        value: option.value,
        type: option.type as OptionType,
      }),
    );

export const formatAction = (
  action: ActionPrismaType,
  options: ProcessOption[],
): Action => {
  const optionFilter = options.find((option) => option.id === action.optionId);

  switch (action.type) {
    case "customWebhook":
      return {
        id: action.id,
        optionFilter,
        actionDetails: {
          ...action.webhookAction,
          __typename: "WebhookAction",
        },
      };
    case "evolveProcess":
      return {
        id: action.id,
        optionFilter,
        actionDetails: {
          __typename: "EvolveProcessAction",
        },
      };
  }
};
