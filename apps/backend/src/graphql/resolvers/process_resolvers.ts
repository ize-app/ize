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
import { refreshDiscordServerRoles } from "@/services/groups/refreshDiscordServerRoles";
import { upsertDiscordEveryoneRole } from "@/services/groups/upsertDiscordEveryoneRole";
import { formatGroup, groupInclude } from "@/utils/formatGroup";
import { createHatsGroup, createNftGroup } from "@/services/groups/createNftGroup";

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
      if (a.identityBlockchain) {
        const res = await prisma.identityBlockchain.upsert({
          where: {
            address: a.identityBlockchain.address,
          },
          update: {},
          create: {
            address: a.identityBlockchain.address,
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
      } else if (a.identityEmail) {
        const res = await prisma.identityEmail.upsert({
          where: {
            email: a.identityEmail.email,
          },
          update: {},
          create: {
            email: a.identityEmail.email,
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
      } else if (a.groupDiscordRole) {
        if (a.groupDiscordRole.roleId === "@everyone") {
          await upsertDiscordEveryoneRole({ serverId: a.groupDiscordRole.serverId, context });
          const group = await prisma.group.findFirstOrThrow({
            include: groupInclude,
            where: {
              GroupDiscordRole: {
                discordServer: {
                  discordServerId: a.groupDiscordRole.serverId,
                },
                name: "@everyone",
              },
            },
          });
          return formatGroup(group);
        } else {
          await refreshDiscordServerRoles({ serverId: a.groupDiscordRole.serverId, context });
          const group = await prisma.group.findFirstOrThrow({
            include: groupInclude,
            where: {
              GroupDiscordRole: {
                discordServer: {
                  discordServerId: a.groupDiscordRole.serverId,
                },
                discordRoleId: a.groupDiscordRole.roleId,
              },
            },
          });
          return formatGroup(group);
        }
      } else if (a.groupNft) {
        return await createNftGroup({
          context,
          address: a.groupNft.address,
          chain: a.groupNft.chain,
          tokenId: a.groupNft.tokenId,
        });
      } else if (a.groupHat) {
        return await createHatsGroup({
          chain: a.groupHat.chain,
          tokenId: a.groupHat.tokenId,
          includeHatsBranch: a.groupHat.inludeHatsBranch,
          context,
        });
      } else {
        throw Error("ERROR unknown new agent type");
      }
    }),
  );
  //@ts-ignore
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

export const processQueries = {
  process,
  processesForCurrentUser,
  processesForGroup,
};

export const processMutations = { newProcess, newEditProcessRequest, newAgents };
