import { prisma } from "../../prisma/client";
import { GraphqlRequestContext } from "../../graphql/context";
import { formatProcess, processInclude } from "backend/src/utils/formatProcess";
import {
  Group,
  Process,
  User,
  NewProcessArgs,
} from "frontend/src/graphql/generated/graphql";
import { discordServers } from "./discord_resolvers";
import { groupInclude, formatGroup } from "backend/src/utils/formatGroup";
import { formatUser, userInclude } from "backend/src/utils/formatUser";

import { groupsForCurrentUser } from "./group_resolvers";

import { newCustomProcess } from "../../services/processes/newProcess";

const newProcess = async (
  root: unknown,
  args: {
    process: NewProcessArgs;
  },
  context: GraphqlRequestContext,
): Promise<string> => {
  return await newCustomProcess(args.process, context);
};

const process = async (
  root: unknown,
  args: {
    processId: string;
  },
  context: GraphqlRequestContext,
): Promise<Process> => {
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
  args: {
    requestRoleOnly: boolean;
  },
  context: GraphqlRequestContext,
): Promise<Process[]> => {
  const currentGroups = await groupsForCurrentUser(root, {}, context);
  const groupIds = currentGroups.map((group) => group.id);

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
                        { groupId: { in: groupIds } },
                        {
                          type: {
                            in: args.requestRoleOnly
                              ? ["Request"]
                              : ["Request", "Respond"],
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
                            in: args.requestRoleOnly
                              ? ["Request"]
                              : ["Request", "Respond"],
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
    },
    include: processInclude,
  });
  const formattedProcesses = processes.map((process) => formatProcess(process));

  return formattedProcesses;
};

const processesForGroup = async (
  root: unknown,
  args: { groupId: string },
  context: GraphqlRequestContext,
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

// get all groups and users that a user is eligible to assign a role in a process
// to start that is just going to be
// 1) groups that are part of groups that user is in
// 2) the user themselves
const groupsAndUsersEliglbeForRole = async (
  root: unknown,
  args: {},
  context: GraphqlRequestContext,
): Promise<(User | Group)[]> => {
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

  const user = await prisma.user.findFirst({
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

export const processMutations = { newProcess };
