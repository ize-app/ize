import { prisma } from "../../prisma/client";
import { GraphqlRequestContext } from "../../graphql/context";
import { formatProcess, processInclude } from "@utils/formatProcess";
import { discordServers } from "./discord_resolvers";
import { groupInclude, formatGroup } from "@utils/formatGroup";
import { formatUser, userInclude } from "@utils/formatUser";

import {
  Group,
  Process,
  User,
  MutationNewProcessArgs,
  MutationNewEditProcessRequestArgs,
  QueryProcessArgs,
  QueryProcessesForCurrentUserArgs,
  QueryProcessesForGroupArgs,
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

const process = async (root: unknown, args: QueryProcessArgs): Promise<Process> => {
  const processData = await prisma.process.findFirstOrThrow({
    include: processInclude,
    where: {
      id: args.processId,
    },
  });

  return formatProcess(processData);
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
): Promise<Process[]> => {
  const processes = await prisma.process.findMany({
    where: {
      OR: [
        {
          currentProcessVersion: {
            roleSet: {
              roleGroups: { some: { groupId: args.groupId } },
            },
          },
        },
        {
          currentProcessVersion: {
            evolveProcess: {
              currentProcessVersion: {
                roleSet: {
                  roleGroups: { some: { groupId: args.groupId, type: "Request" } },
                },
              },
            },
          },
        },
      ],
    },

    include: processInclude,
  });

  const formattedProcesses = processes.map((process) => formatProcess(process));

  return formattedProcesses;
};

const groupsAndUsersEliglbeForRole = async (
  root: unknown,
  args: Record<string, never>,
  context: GraphqlRequestContext,
): Promise<(User | Group)[]> => {
  if (!context.currentUser) throw Error("ERROR processesForCurrentUser: No user is authenticated");

  const servers = await discordServers(root, {}, context);
  const serverIds = await servers.map((server) => server.id);
  const arr: (User | Group)[] = [];

  const groups = await prisma.group.findMany({
    where: {
      discordRoleGroup: {
        discordServer: {
          discordServerId: { in: serverIds },
        },
      },
    },
    include: groupInclude,
  });
  const formattedGroups = groups.map((group) => formatGroup(group));

  const user = await prisma.user.findFirstOrThrow({
    where: {
      id: context.currentUser.id,
    },
    include: userInclude,
  });
  const formattedUser = formatUser(user);

  const res: (User | Group)[] = arr.concat(formattedGroups, formattedUser);
  return res;
};

export const processQueries = {
  process,
  processesForCurrentUser,
  processesForGroup,
  groupsAndUsersEliglbeForRole,
};

export const processMutations = { newProcess, newEditProcessRequest };
