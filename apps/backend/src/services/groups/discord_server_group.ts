import { GraphqlRequestContext } from "@graphql/context";
import { prisma } from "../../prisma/client";
import { DiscordApi } from "../../discord/api";
import { GroupType } from "../../models/group";
import { randomUUID } from "crypto";
import { Permissions } from "../../models/permissions";
import { Prisma, PrismaClient } from "@prisma/client";

export enum ProcessConfigurationOption {
  BenevolentDictator = "BenevolentDictator",
  TrustedAdvisors = "TrustedAdvisors",
  FullDecentralization = "FullDecentralization",
}

export async function setUpDiscordServerGroup(
  {
    serverId,
    processConfigurationOption,
    roleId,
    numberOfResponses,
  }: {
    serverId: string;
    processConfigurationOption: ProcessConfigurationOption;
    roleId?: string;
    numberOfResponses?: number;
  },
  context: GraphqlRequestContext
) {
  const botApi = DiscordApi.forBotUser();
  const server = await botApi.getDiscordServer(serverId);
  const serverRoles = await botApi.getDiscordServerRoles(serverId);

  const everyoneRole = serverRoles.find((role) => role.name === "@everyone");

  return await prisma.$transaction(async (transaction) => {
    if (!server) {
      throw new Error("Cannot find server");
    }

    if (!everyoneRole) {
      throw new Error("Cannot find @everyone role");
    }

    const serverGroup = await createDiscordServerGroup({
      serverId,
      name: server.name,
      creatorId: context.currentUser.id,
      everyoneRoleId: everyoneRole.id,
      transaction,
    });

    const serverEditProcess = await createEditProcessForGroup({ transaction });
    const defaultProcesses = await createDefaultProcesses({
      editProcessId: serverEditProcess.id,
      transaction,
    });

    if (
      processConfigurationOption ===
      ProcessConfigurationOption.BenevolentDictator
    ) {
      // Only the current user can respond/vote on all processes
      await transaction.processUser.createMany({
        data: [serverEditProcess, ...defaultProcesses].map((process) => ({
          processId: process.id,
          userId: context.currentUser.id,
          permissions: [Permissions.Respond],
        })),
      });

      // Request privileges are given to everyone
      await transaction.processGroup.createMany({
        data: [serverEditProcess, ...defaultProcesses].map((process) => ({
          processId: process.id,
          groupId: serverGroup.id,
          permissions: [Permissions.Request],
        })),
      });
    } else if (
      processConfigurationOption === ProcessConfigurationOption.TrustedAdvisors
    ) {
      const role = serverRoles.find((role) => role.id === roleId);

      if (!role) {
        throw new Error("Cannot find role");
      }

      const roleGroup = await createDiscordRoleGroup({
        roleId: roleId,
        name: role.name,
        discordServerGroupId: serverGroup.DiscordServerGroup.at(0)?.id,
        creatorId: context.currentUser.id,
        transaction,
      });

      const roleEditProcess = await createEditProcessForGroup({ transaction });

      // The selected role can can request and vote on its own process edits
      await transaction.processGroup.create({
        data: {
          processId: roleEditProcess.id,
          groupId: roleGroup.id,
          permissions: [Permissions.Request, Permissions.Respond],
        },
      });

      // Only user can vote on process edits
      await transaction.processUser.create({
        data: {
          processId: serverEditProcess.id,
          userId: context.currentUser.id,
          permissions: [Permissions.Respond],
        },
      });

      // Selected role can propose process edits
      await transaction.processGroup.create({
        data: {
          processId: serverEditProcess.id,
          groupId: roleGroup.id,
          permissions: [Permissions.Request],
        },
      });

      // Only the selected role can vote on default processes
      await transaction.processGroup.createMany({
        data: [...defaultProcesses].map((process) => ({
          processId: process.id,
          groupId: roleGroup.id,
          permissions: [Permissions.Respond],
        })),
      });

      // Everyone can request default processes
      await transaction.processGroup.createMany({
        data: [...defaultProcesses].map((process) => ({
          processId: process.id,
          groupId: serverGroup.id,
          permissions: [Permissions.Request],
        })),
      });
    } else if (
      processConfigurationOption ===
      ProcessConfigurationOption.FullDecentralization
    ) {
      const role = serverRoles.find((role) => role.id === roleId);

      if (!role) {
        throw new Error("Cannot find role");
      }

      const roleGroup = await createDiscordRoleGroup({
        roleId: roleId,
        name: role.name,
        discordServerGroupId: serverGroup.DiscordServerGroup.at(0)?.id,
        creatorId: context.currentUser.id,
        transaction,
      });

      const roleEditProcess = await createEditProcessForGroup({ transaction });

      // The selected role can can request and vote on its own process edits
      await transaction.processGroup.create({
        data: {
          processId: roleEditProcess.id,
          groupId: roleGroup.id,
          permissions: [Permissions.Request, Permissions.Respond],
        },
      });

      // The selected role can can request and vote on server process edits
      await transaction.processGroup.create({
        data: {
          processId: serverEditProcess.id,
          groupId: roleGroup.id,
          permissions: [Permissions.Request, Permissions.Respond],
        },
      });

      // The selected role can can request and vote on default processes
      await transaction.processGroup.createMany({
        data: [...defaultProcesses].map((process) => ({
          processId: process.id,
          groupId: roleGroup.id,
          permissions: [Permissions.Request, Permissions.Respond],
        })),
      });
    } else {
      throw new Error("Invalid process configuration option");
    }

    return serverGroup;
  });
}

async function createDiscordServerGroup({
  serverId,
  creatorId,
  everyoneRoleId,
  name,
  transaction = prisma,
}: {
  serverId: string;
  creatorId: string;
  everyoneRoleId: string;
  name: string;
  transaction?: Prisma.TransactionClient;
}) {
  const existingGroup = await transaction.group.findFirst({
    include: {
      DiscordServerGroup: {
        where: {
          discordServerId: serverId,
        },
      },
    },
  });

  if (existingGroup) {
    throw new Error("Group already exists");
  }

  const discordServerGroupId = randomUUID();

  return await transaction.group.create({
    include: { DiscordServerGroup: true },
    data: {
      name,
      creatorId,
      activeAt: new Date(),
      DiscordServerGroup: {
        create: {
          id: discordServerGroupId,
          discordServerId: serverId,
        },
      },
      DiscordRoleGroup: {
        create: {
          discordServerGroupId,
          discordRoleId: everyoneRoleId,
        },
      },
    },
  });
}

async function createDiscordRoleGroup({
  roleId,
  name,
  discordServerGroupId,
  creatorId,
  transaction = prisma,
}: {
  roleId: string;
  name: string;
  discordServerGroupId: string;
  creatorId: string;
  transaction?: Prisma.TransactionClient;
}) {
  return await transaction.group.create({
    data: {
      name: name,
      creatorId,
      activeAt: new Date(),
      DiscordRoleGroup: {
        create: {
          discordRoleId: roleId,
          discordServerGroupId: discordServerGroupId,
        },
      },
    },
  });
}

async function createEditProcessForGroup({
  transaction = prisma,
}: {
  transaction?: Prisma.TransactionClient;
}) {
  // Create Default Processes where the server group has request permissions
  const editProcessId = randomUUID();
  return await transaction.process.create({
    data: {
      id: editProcessId,
      type: GroupType.EditProcess,
      name: "Edit Process",
      editProcessId,
    },
  });
}

async function createProcessForGroup({
  type,
  name,
  editProcessId,
  transaction = prisma,
}: {
  type: GroupType;
  editProcessId: string;
  name: string;
  transaction?: Prisma.TransactionClient;
}) {
  return await transaction.process.create({
    data: {
      type,
      name,
      editProcessId,
    },
  });
}

async function createDefaultProcesses({
  editProcessId,
  transaction,
}: {
  editProcessId: string;
  transaction?: Prisma.TransactionClient;
}) {
  return Promise.all([
    createProcessForGroup({
      type: GroupType.CreateProcessForRoleMembership,
      name: "Create Process For Role Membership",
      editProcessId,
      transaction,
    }),
    createProcessForGroup({
      type: GroupType.CreateCultsGroupForDiscordRole,
      name: "Create Cults Group For Discord Role",
      editProcessId,
      transaction,
    }),
  ]);
}

// ---------------- Helpers ----------------

function makesRoleGroup(
  processConfigurationOption: ProcessConfigurationOption
) {
  return (
    processConfigurationOption === ProcessConfigurationOption.TrustedAdvisors ||
    processConfigurationOption ===
      ProcessConfigurationOption.FullDecentralization
  );
}
