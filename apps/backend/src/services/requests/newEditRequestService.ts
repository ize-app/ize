import { GraphqlRequestContext } from "@graphql/context";
import { prisma } from "../../prisma/client";
import { ActionType, OptionSystemPayload, Prisma } from "@prisma/client";
import { ProcessType } from "@prisma/client";

import {
  EvolveArgs,
  NewEditProcessRequestArgs,
  NewProcessArgs,
} from "frontend/src/graphql/generated/graphql";
import { newRequestService } from "./newRequestService";
import { diff } from "deep-object-diff";
import {
  createAction,
  createDecisionSystem,
  createInputTemplateSet,
  createOptionSystem,
  createRoleSet,
} from "@services/processes/processHelpers";
import { optionSystemInclude } from "../../utils/formatProcess";

export const newEditRequestService = async (
  {
    args,
    transaction = prisma,
  }: {
    args: NewEditProcessRequestArgs;
    transaction?: Prisma.TransactionClient;
  },
  context: GraphqlRequestContext,
) => {
  const diffProcess: NewProcessArgs = diff(
    args.currentProcess,
    args.evolvedProcess,
  ) as NewProcessArgs;

  const currentProcessRecord = await transaction.process.findFirst({
    include: {
      currentProcessVersion: {
        include: {
          optionSystem: {
            include: optionSystemInclude,
          },
        },
      },
    },
    where: {
      id: args.processId,
    },
  });

  const currVers = currentProcessRecord.currentProcessVersion;
  const evolveProcessId = currVers.evolveProcessId;

  const currentEvolveProcessRecord = await transaction.process.findFirst({
    include: {
      currentProcessVersion: {
        include: {
          inputTemplateSet: {
            include: {
              inputTemplates: true,
            },
          },
        },
      },
    },
    where: {
      id: evolveProcessId,
    },
  });

  const currEvolveVers = currentEvolveProcessRecord.currentProcessVersion;

  // if the option set has changed, need to refind the action filter
  const currOptionSystem = currVers.optionSystem;

  const newOptionSystem = diffProcess.options
    ? await createOptionSystem(
        { options: args.evolvedProcess.options, transaction },
        context,
      )
    : null;

  const actionOptionFilterId = args.evolvedProcess.action?.optionTrigger
    ? (
        newOptionSystem ?? currOptionSystem
      ).defaultProcessOptionSet.options.find(
        (option) => option.value === args.evolvedProcess.action.optionTrigger,
      ).id
    : null;

  // create process version record of both the core process record and it's accompanying edit process
  const newProcessVersionArgs: Prisma.ProcessVersionCreateArgs = {
    data: {
      processId: args.processId,
      name: diffProcess.name ? args.evolvedProcess.name : currVers.name,
      description: diffProcess.description
        ? args.evolvedProcess.description
        : currVers.description,
      expirationSeconds: diffProcess.decision?.expirationSeconds
        ? args.evolvedProcess.decision.expirationSeconds
        : currVers.expirationSeconds,
      creatorId: context?.currentUser?.id,
      optionSystemId: diffProcess.options
        ? (
            await createOptionSystem(
              { options: args.evolvedProcess.options, transaction },
              context,
            )
          ).id
        : currVers.optionSystemId,
      inputTemplateSetId: diffProcess.inputs
        ? (
            await createInputTemplateSet(
              { inputs: args.evolvedProcess.inputs, transaction },
              context,
            )
          ).id
        : currVers.inputTemplateSetId,
      // TODO: Clean this up to not be so brittle - move expiration seconds out
      decisionSystemId:
        diffProcess.decision?.absoluteDecision ||
        diffProcess.decision?.percentageDecision
          ? (
              await createDecisionSystem(
                { decision: args.evolvedProcess.decision, transaction },
                context,
              )
            ).id
          : currVers.decisionSystemId,
      roleSetId: diffProcess.roles
        ? (
            await createRoleSet(
              { roles: args.evolvedProcess.roles, transaction },
              context,
            )
          ).id
        : currVers.roleSetId,
      actionId: args.evolvedProcess.action
        ? diffProcess.action || diffProcess.options
          ? (
              await createAction(
                {
                  type: ActionType.customWebhook,
                  action: args.evolvedProcess.action,
                  filterOptionId: actionOptionFilterId,
                },
                context,
              )
            ).id
          : currVers.actionId
        : null,
      evolveProcessId: currVers.evolveProcessId,
    },
  };

  const evolveProcessVersionArgs: Prisma.ProcessVersionCreateArgs = {
    data: {
      //   ...currEvolveVers,
      processId: currEvolveVers.processId,
      name: currEvolveVers.name,
      description: currEvolveVers.description,
      optionSystemId: currEvolveVers.optionSystemId,
      inputTemplateSetId: currEvolveVers.inputTemplateSetId,
      expirationSeconds: diffProcess.evolve?.decision?.expirationSeconds
        ? args.evolvedProcess.evolve.decision?.expirationSeconds
        : currEvolveVers.expirationSeconds,
      creatorId: context?.currentUser?.id,
      // TODO: Clean this up to not be so brittle - move expiration seconds out
      decisionSystemId:
        diffProcess.evolve?.decision?.absoluteDecision ||
        diffProcess.evolve?.decision?.percentageDecision
          ? (
              await createDecisionSystem(
                {
                  decision: args.evolvedProcess.evolve.decision,
                  transaction,
                },
                context,
              )
            ).id
          : currEvolveVers.decisionSystemId,
      roleSetId: diffProcess.evolve?.roles
        ? (
            await createRoleSet(
              { roles: args.evolvedProcess.evolve.roles, transaction },
              context,
            )
          ).id
        : currEvolveVers.roleSetId,
      actionId: currEvolveVers.actionId,
      parentProcessId: currEvolveVers.parentProcessId,
    },
  };

  const newProcessVersions = await Promise.all(
    [newProcessVersionArgs, evolveProcessVersionArgs].map(
      (processVersionArgs) => {
        return transaction.processVersion.create({ ...processVersionArgs });
      },
    ),
  );

  const evolveRequestTitleInput =
    currEvolveVers.inputTemplateSet.inputTemplates.find(
      (input) => input.name === "Request title",
    );

  const evolveRequestProcessVersionInput =
    currEvolveVers.inputTemplateSet.inputTemplates.find(
      (input) => input.name === "Process versions",
    );

  // create inputs for the request
  // process version of proposed but also need to have process version of edit - might need a special resolver
  // finally create the request using traditional means
  return await newRequestService(
    {
      args: {
        processId: evolveProcessId,
        requestInputs: [
          {
            inputId: evolveRequestTitleInput.id,
            value: `Evolve process of "${currVers.name}"`,
          },
          {
            inputId: evolveRequestProcessVersionInput.id,
            value: await JSON.stringify(
              newProcessVersions.map((version) => version.id),
            ),
          },
        ],
      },
      transaction,
    },
    context,
  );
};
