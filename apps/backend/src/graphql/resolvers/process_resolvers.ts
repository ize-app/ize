import { prisma } from "../../prisma/client";
import { GraphqlRequestContext } from "../../graphql/context";
import { formatProcess, processInclude } from "@utils/formatProcess";
import { getGroupsAndUsersEliglbeForRole } from "@/services/processes/getGroupsAndUsersEligibleForRole";

import {
  Group,
  Process,
  User,
  MutationNewProcessArgs,
  MutationNewEditProcessRequestArgs,
  MutationNewAgentsArgs,
  QueryProcessArgs,
  QueryProcessesForCurrentUserArgs,
  QueryProcessesForGroupArgs,
  Agent,
  NewAgentTypes,
  // Agent,
} from "@graphql/generated/resolver-types";

import { newCustomProcess } from "@services/processes/newProcess";
import { newEditRequestService } from "@services/requests/newEditRequestService";
import { processesForUserService } from "@services/processes/processesForUserService";

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

  return formatProcess(processData, context.currentUser);
};

const newAgents = async (
  root: unknown,
  args: MutationNewAgentsArgs,
  context: GraphqlRequestContext,
): Promise<Agent[]> => {
  // ): Promise<Agent[]> => {
  if (!context.currentUser) throw Error("ERROR Unauthenticated user");
  const agents = await Promise.all(
    args.agents.map(async (a) => {
      switch (a.type) {
        case NewAgentTypes.IdentityBlockchain: {
          const res = await prisma.identityBlockchain.upsert({
            where: {
              address: a.value,
            },
            update: {},
            create: {
              address: a.value,
              Identity: {
                create: {},
              },
            },
          });
          return {
            __typename: "Identity",
            identityType: {
              __typename: "IdentityBlockchain",
              ...res,
            },
            id: res.identityId,
            name: res.address,
          } as Agent;
        }
        case NewAgentTypes.IdentityEmail: {
          const res = await prisma.identityEmail.upsert({
            where: {
              email: a.value,
            },
            update: {},
            create: {
              email: a.value,
              Identity: {
                create: {},
              },
            },
          });
          return {
            __typename: "Identity",
            identityType: {
              __typename: "IdentityEmail",
              ...res,
            },
            id: res.identityId,
            name: res.email,
          } as Agent;
        }
        default:
          throw Error("ERROR unknown new agent type");
      }
    }),
  );
  return agents;
};

const processesForCurrentUser = async (
  root: unknown,
  args: QueryProcessesForCurrentUserArgs,
  context: GraphqlRequestContext,
): Promise<Process[]> => {
  return await processesForUserService(args, context);
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

  const formattedProcesses = processes.map((process) =>
    formatProcess(process, context.currentUser),
  );

  return formattedProcesses;
};

const groupsAndUsersEliglbeForRole = async (
  root: unknown,
  args: Record<string, never>,
  context: GraphqlRequestContext,
): Promise<(User | Group)[]> => {
  return await getGroupsAndUsersEliglbeForRole(root, args, context);
};

export const processQueries = {
  process,
  processesForCurrentUser,
  processesForGroup,
  groupsAndUsersEliglbeForRole,
};

export const processMutations = { newProcess, newEditProcessRequest, newAgents };
