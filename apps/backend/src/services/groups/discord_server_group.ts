import { GraphqlRequestContext } from "@graphql/context";
import { prisma } from "../../prisma/client";
import { DiscordApi } from "../../discord/api";
import { randomUUID } from "crypto";
import { Prisma, PrismaClient } from "@prisma/client";

export async function setUpDiscordServerService(
  {
    serverId,
  }: {
    serverId: string;
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

    const roleGroup = await createInitialRoleGroups({
      serverId,
      name: everyoneRole.name,
      creatorId: context.currentUser.id,
      everyoneRoleId: everyoneRole.id,
      transaction,
    });

    return roleGroup;
  });
}

async function createInitialRoleGroups({
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
    where: {
      discordRoleGroup: {
        discordServer: {
          discordServerId: serverId
        }
      }
    }
  });

  if (existingGroup) {
    throw new Error("Group already exists");
  }

  const discordRoleGroupId = randomUUID();

  return await transaction.group.create({
    include: { discordRoleGroup: true },
    data: {
      name,
      creatorId,
      activeAt: new Date(),
      discordRoleGroup: {
        create: {
          id: discordRoleGroupId,
          discordRoleId: everyoneRoleId,
          discordServer: {
            create: {
              discordServerId: serverId
            }
          }
        },
      },
    },
  });
}

// async function createDiscordRoleGroup({
//   roleId,
//   name,
//   discordServerGroupId,
//   creatorId,
//   transaction = prisma,
// }: {
//   roleId: string;
//   name: string;
//   discordServerGroupId: string;
//   creatorId: string;
//   transaction?: Prisma.TransactionClient;
// }) {
//   return await transaction.group.create({
//     data: {
//       name: name,
//       creatorId,
//       activeAt: new Date(),
//       discordRoleGroup: {
//         create: {
//           discordRoleId: roleId,
//           discordServerGroupId: discordServerGroupId,
//         },
//       },
//     },
//   });
// }
