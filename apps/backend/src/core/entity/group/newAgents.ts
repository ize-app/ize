import { prisma } from "../../../prisma/client";
import { GraphqlRequestContext } from "../../../graphql/context";
import { MutationNewAgentsArgs, Agent } from "@graphql/generated/resolver-types";

import { refreshDiscordServerRoles } from "@/core/entity/group/upsertGroups/refreshDiscordServerRoles";
import { upsertDiscordEveryoneRole } from "@/core/entity/group/upsertGroups/upsertDiscordEveryoneRole";
import { formatGroup, groupInclude } from "@/core/entity/group/formatGroup";
import { createHatsGroup, createNftGroup } from "@/core/entity/group/upsertGroups/createNftGroup";
import { upsertBlockchainIdentity } from "../identity/upsertBlockchainIdentity";
import { upsertEmailIdentity } from "../identity/upsertEmailIdentity";

export const newAgents = async (
  args: MutationNewAgentsArgs,
  context: GraphqlRequestContext,
): Promise<Agent[]> => {
  // ): Promise<Agent[]> => {
  if (!context.currentUser) throw Error("ERROR Unauthenticated user");
  const agents = await Promise.all(
    args.agents.map(async (a) => {
      if (a.identityBlockchain) {
        return await upsertBlockchainIdentity({ newAgent: a, context });
      } else if (a.identityEmail) {
        return await upsertEmailIdentity({ newAgent: a, context });
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
