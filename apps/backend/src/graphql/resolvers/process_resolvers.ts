import { prisma } from "../../prisma/client";
import { GraphqlRequestContext } from "../../graphql/context";
import { formatProcess, processInclude } from "backend/src/utils/formatProcess";
import { discordServers } from "./discord_resolvers";
import { groupInclude, formatGroup } from "backend/src/utils/formatGroup";
import { formatUser, userInclude } from "backend/src/utils/formatUser";

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

import { newCustomProcess } from "../../services/processes/newProcess";
import { newEditRequestService } from "@services/requests/newEditRequestService";

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
  if (!context.currentUser) throw Error("ERROR processesForCurrentUser: No user is authenticated");

  const processes = await prisma.process.findMany({
    where: {
      // Add editProcess lookup later
      OR: [
        {
          currentProcessVersion: {
            roleSet: {
              OR: [
                {
                  roleGroups: {
                    some: {
                      AND: [
                        { groupId: { in: args.groupIds ?? [] } },
                        {
                          type: {
                            in: args.requestRoleOnly ? ["Request"] : ["Request", "Respond"],
                          },
                        },
                      ],
                    },
                  },
                },
                {
                  roleUsers: {
                    some: {
                      AND: [
                        { userId: context.currentUser.id },
                        {
                          type: {
                            in: args.requestRoleOnly ? ["Request"] : ["Request", "Respond"],
                          },
                        },
                      ],
                    },
                  },
                },
              ],
            },
          },
        },
      ],
      type: { not: "Evolve" },
    },
    include: processInclude,
  });
  const formattedProcesses = processes.map((process) => formatProcess(process));

  return formattedProcesses;
};

const processesForGroup = async (
  root: unknown,
  args: QueryProcessesForGroupArgs,
): Promise<Process[]> => {
  const processes = await prisma.process.findMany({
    where: {
      currentProcessVersion: {
        roleSet: {
          roleGroups: { some: { groupId: args.groupId } },
        },
      },
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
