import { prisma } from "../../prisma/client";
import { GraphqlRequestContext } from "../../graphql/context";
import { formatProcess, processInclude } from "backend/src/utils/formatProcess";
import { Process } from "frontend/src/graphql/generated/graphql";

import { groupsForCurrentUser } from "./group_resolvers";

import {
  newCustomProcess,
  NewCustomProcessInputs,
} from "../../services/processes/newProcess";

const newProcess = async (
  root: unknown,
  args: {
    process: NewCustomProcessInputs;
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
  args: {},
  context: GraphqlRequestContext,
): Promise<Process[]> => {
  const currentGroups = await groupsForCurrentUser(root, {}, context);
  const groupIds = currentGroups.map((group) => group.id);

  const processes = await prisma.process.findMany({
    where: {
      OR: [
        {
          currentProcessVersion: {
            roleSet: {
              OR: [
                { roleGroups: { some: { groupId: { in: groupIds } } } },
                { roleUsers: { some: { userId: context.currentUser.id } } },
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

export const processQueries = { process, processesForCurrentUser };

export const processMutations = { newProcess };
