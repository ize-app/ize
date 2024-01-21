import {
  DecisionSystemTypes,
  Prisma,
  ProcessType as PrismaProcessType,
  ActionType as PrismaActionType,
  WebhookAction,
} from "@prisma/client";
import { groupInclude, formatGroup } from "@utils/formatGroup";
import { userInclude, formatUser, MePrismaType } from "@utils/formatUser";
import { identityInclude, formatIdentity } from "./formatIdentity";

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
  ParentProcess,
  ProcessType,
  RoleType,
  DecisionTypes,
} from "@graphql/generated/resolver-types";

export interface ProcessVersion
  extends Omit<Process, "id" | "createdAt" | "currentProcessVersionId" | "type"> {}

export const roleSetInclude = Prisma.validator<Prisma.RoleSetInclude>()({
  RoleGroups: {
    include: {
      Group: {
        include: groupInclude,
      },
    },
  },
  RoleIdentities: {
    include: {
      Identity: {
        include: identityInclude,
      },
    },
  },
});

export type RoleSetPrismaType = Prisma.RoleSetGetPayload<{
  include: typeof roleSetInclude;
}>;

const inputTemplateInclude = Prisma.validator<Prisma.InputTemplateInclude>()({});

export const inputTemplateSetInclude = Prisma.validator<Prisma.InputTemplateSetInclude>()({
  inputTemplates: inputTemplateInclude,
});

export type InputTemplatSetPrismaType = Prisma.InputTemplateSetGetPayload<{
  include: typeof inputTemplateSetInclude;
}>;

export const optionSystemInclude = Prisma.validator<Prisma.OptionSystemInclude>()({
  defaultProcessOptionSet: {
    include: {
      options: true,
    },
  },
});

export type OptionSystemPrismaType = Prisma.OptionSystemGetPayload<{
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

const parentInclude = Prisma.validator<Prisma.ProcessInclude>()({
  currentProcessVersion: true,
});

type ParentPrismaType = Prisma.ProcessGetPayload<{
  include: typeof parentInclude;
}>;

export const processVersionInclude = Prisma.validator<Prisma.ProcessVersionInclude>()({
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
  parentProcess: {
    include: {
      currentProcessVersion: true,
    },
  },
});

export type ProcessVersionPrismaType = Prisma.ProcessVersionGetPayload<{
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

// Used to format all processes, except for evolve processes
export const formatProcess = (
  processData: ProcessPrismaType,
  user: MePrismaType | undefined | null,
): Process => {
  const { currentProcessVersion } = processData;

  if (!currentProcessVersion)
    throw Error(
      "ERROR formatProcess: Can't find current process version of process id: " + processData.id,
    );
  if (!currentProcessVersion.evolveProcess)
    throw Error("ERROR formatProcess: Can't find evolve process of process id:" + processData.id);

  const formattedProcessVersion = formatProcessVersion(currentProcessVersion, user);

  const data: Process = {
    id: processData.id,
    currentProcessVersionId: currentProcessVersion?.id,
    type: processData.type as ProcessType,
    createdAt: processData.createdAt.toString(),
    evolve:
      processData.type === ProcessType.Evolve
        ? null
        : formatEvolveProcess(currentProcessVersion.evolveProcess, user),
    ...formattedProcessVersion,
  };
  return data;
};

export const formatEvolveProcess = (
  processData: EditProcessPrismaType,
  user: MePrismaType | undefined | null,
): Process => {
  const { currentProcessVersion } = processData;

  if (!currentProcessVersion)
    throw Error(
      "ERROR formatProcess: Can't find current process version of process id: " + processData.id,
    );

  const formattedProcessVersion = formatProcessVersion(currentProcessVersion, user);

  const data: Process = {
    id: processData.id,
    currentProcessVersionId: currentProcessVersion?.id,
    createdAt: processData.createdAt.toString(),
    type: processData.type as ProcessType,
    ...formattedProcessVersion,
  };
  return data;
};

export const formatProcessVersion = (
  processVersion: ProcessVersionPrismaType,
  user: MePrismaType | undefined | null,
): ProcessVersion => {
  const { creator, optionSystem, inputTemplateSet, decisionSystem, action, roleSet } =
    processVersion;

  const options = formatOptions(optionSystem);

  const data: ProcessVersion = {
    name: formatName(
      processVersion.name,
      processVersion.process.type,
      processVersion.parentProcess,
    ),
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
    parent: formatParent(processVersion.parentProcess),
    roles: formatRoles(roleSet, user),
  };

  return data;
};

const formatName = (name: string, type: PrismaProcessType, parent: ParentPrismaType | null) => {
  if (type === ProcessType.Evolve && parent?.currentProcessVersion) {
    return `Evolve process of "${parent.currentProcessVersion.name}"`;
  } else return name;
};

const formatRoles = (roleSet: RoleSetPrismaType, user: MePrismaType | undefined | null): Roles => {
  const roles: Roles = { request: [], respond: [], edit: undefined };
  roleSet.RoleGroups.forEach((role) => {
    if (role.type === RoleType.Request) roles.request.push(formatGroup(role.Group));
    else if (role.type === RoleType.Respond) roles.respond.push(formatGroup(role.Group));
  });

  roleSet.RoleIdentities.forEach((role) => {
    if (role.type === RoleType.Request) roles.request.push(formatIdentity(role.Identity, user));
    else if (role.type === RoleType.Respond)
      roles.respond.push(formatIdentity(role.Identity, user));
  });

  return roles;
};

export const formatDecisionSystem = (decisionSystem: DecisionSystemPrismaType): DecisionTypes => {
  switch (decisionSystem.type) {
    case DecisionSystemTypes.Absolute:
      return {
        __typename: "AbsoluteDecision",
        threshold: (decisionSystem.absoluteDecisionSystem as AbsoluteDecision).threshold,
      };
    case DecisionSystemTypes.Percentage:
      return {
        __typename: "PercentageDecision",
        quorum: (decisionSystem.percentageDecisionSystem as PercentageDecision).quorum,
        percentage: (decisionSystem.percentageDecisionSystem as PercentageDecision).percentage,
      };
  }
};

export const formatOptions = (optionSystem: OptionSystemPrismaType): ProcessOption[] => {
  if (!optionSystem.defaultProcessOptionSet) throw Error("ERROR: No default options");
  return optionSystem.defaultProcessOptionSet.options
    .sort((a, b) => a.position - b.position)
    .map(
      (option): ProcessOption => ({
        id: option.id,
        value: option.value,
        type: option.type as OptionType,
      }),
    );
};

export const formatAction = (action: ActionPrismaType, options: ProcessOption[]): Action => {
  const optionFilter = options.find((option) => option.id === action.optionId);

  switch (action.type) {
    case PrismaActionType.customWebhook:
      return {
        id: action.id,
        optionFilter,
        actionDetails: {
          ...(action.webhookAction as WebhookAction),
          __typename: "WebhookAction",
        },
      };
    case PrismaActionType.evolveProcess:
      return {
        id: action.id,
        optionFilter,
        actionDetails: {
          __typename: "EvolveProcessAction",
        },
      };
  }
};

export const formatParent = (parent: ParentPrismaType | null): ParentProcess | null => {
  if (parent && parent.currentProcessVersion)
    return {
      id: parent.id,
      name: parent.currentProcessVersion?.name,
    };
  else return null;
};
