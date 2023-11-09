import { Prisma, PrismaClient } from "@prisma/client";
import { groupInclude, formatGroup } from "backend/src/utils/formatGroup";
import { userInclude, formatUser } from "backend/src/utils/formatUser";

import {
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

const decisionSystemInclude = Prisma.validator<Prisma.DecisionSystemInclude>()({
  absoluteDecisionSystem: true,
  percentageDecisionSystem: true,
});

type DecisionSystemPrismaType = Prisma.DecisionSystemGetPayload<{
  include: typeof decisionSystemInclude;
}>;

export const processVersionInclude =
  Prisma.validator<Prisma.ProcessVersionInclude>()({
    creator: {
      include: userInclude,
    },
    process: true,
    optionSystem: {
      include: {
        defaultProcessOptionSet: {
          include: {
            options: true,
          },
        },
      },
    },
    inputTemplateSet: {
      include: {
        inputTemplates: true,
      },
    },
    decisionSystem: {
      include: decisionSystemInclude,
    },
    action: true,
    roleSet: {
      include: roleSetInclude,
    },
  });

type ProcessVersionPrismaType = Prisma.ProcessVersionGetPayload<{
  include: typeof processVersionInclude;
}>;

export const processInclude = Prisma.validator<Prisma.ProcessInclude>()({
  currentProcessVersion: {
    include: processVersionInclude,
  },
});

type ProcessPrismaType = Prisma.ProcessGetPayload<{
  include: typeof processInclude;
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
  const data = {
    currentProcessVersionId: processVersion?.id,
    name: processVersion.name,
    description: processVersion.description,
    expirationSeconds: processVersion.expirationSeconds,
    creator: formatUser(creator),
    options: optionSystem.defaultProcessOptionSet.options
      .sort((a, b) => a.position - b.position)
      .map(
        (option): ProcessOption => ({
          id: option.id,
          value: option.value,
          type: option.type as OptionType,
        }),
      ),
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
    webhookUri:
      action && action.type === "customWebhook" && action?.config
        ? // @ts-ignore
          JSON.parse(action.config as string).uri
        : undefined,
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
