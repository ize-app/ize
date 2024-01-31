import { prisma } from "../../prisma/client";
import { GraphqlRequestContext } from "../../graphql/context";
import { formatProcess, processInclude } from "@utils/formatProcess";
import {
  Process,
  MutationNewProcessArgs,
  MutationNewEditProcessRequestArgs,
  MutationNewAgentsArgs,
  QueryProcessArgs,
  QueryProcessesForCurrentUserArgs,
  QueryProcessesForGroupArgs,
  Agent,
} from "@graphql/generated/resolver-types";

import { newCustomProcess } from "@services/processes/newProcess";
import { newEditRequestService } from "@services/requests/newEditRequestService";
import { processesForUserService } from "@services/processes/processesForUserService";
import { newAgents as newAgentsService } from "@/services/processes/newAgents";
import { getGroupIdsOfUser } from "@/services/groups/getGroupIdsOfUser";

const newProcess = async (
  root: unknown,
  args: MutationNewProcessArgs,
  context: GraphqlRequestContext,
): Promise<string> => {
  return await newCustomProcess(args.process, context);
};

const newEditProcessRequest = async (
  root: unknown,
  args: MutationNewEditProcessRequestArgs,
  context: GraphqlRequestContext,
): Promise<string> => {
  return await newEditRequestService({ args: args.inputs }, context);
};

const process = async (
  root: unknown,
  args: QueryProcessArgs,
  context: GraphqlRequestContext,
): Promise<Process> => {
  const processData = await prisma.process.findFirstOrThrow({
    include: processInclude,
    where: {
      id: args.processId,
    },
  });

  const groupIds = await getGroupIdsOfUser({ user: context.currentUser });

  return formatProcess(processData, context.currentUser, groupIds);
};

const newAgents = async (
  root: unknown,
  args: MutationNewAgentsArgs,
  context: GraphqlRequestContext,
): Promise<Agent[]> => {
  return await newAgentsService(args, context);
};

const processesForCurrentUser = async (
  root: unknown,
  args: QueryProcessesForCurrentUserArgs,
  context: GraphqlRequestContext,
): Promise<Process[]> => {
  return await processesForUserService({ args, context });
};

/* 
Gets all processes that either 
1) give request/respond permissions to that group or 
2) have an evovle process with reqest permissions to that group. 
Note: In the process table UI, "evolve processes" are not shown by themselves, only as attached to their "parent" process
*/
const processesForGroup = async (
  root: unknown,
  args: QueryProcessesForGroupArgs,
  context: GraphqlRequestContext,
): Promise<Process[]> => {
  const processes = await prisma.process.findMany({
    where: {
      OR: [
        {
          currentProcessVersion: {
            roleSet: {
              RoleGroups: { some: { groupId: args.groupId } },
            },
          },
        },
        {
          currentProcessVersion: {
            evolveProcess: {
              currentProcessVersion: {
                roleSet: {
                  RoleGroups: { some: { groupId: args.groupId, type: "Request" } },
                },
              },
            },
          },
        },
      ],
    },

    include: processInclude,
  });

  const groupIds = await getGroupIdsOfUser({ user: context.currentUser });

  const formattedProcesses = processes.map((process) =>
    formatProcess(process, context.currentUser, groupIds),
  );

  return formattedProcesses;
};

export const processQueries = {
  process,
  processesForCurrentUser,
  processesForGroup,
};

export const processMutations = { newProcess, newEditProcessRequest, newAgents };
