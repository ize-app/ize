import { prisma } from "../../prisma/client";
import { GraphqlRequestContext } from "../../graphql/context";
import { MutationNewEntitiesArgs, Entity } from "@graphql/generated/resolver-types";

import { refreshDiscordServerRoles } from "@/core/entity/group/newGroup/refreshDiscordServerRoles";
import { newDiscordEveryoneRole } from "@/core/entity/group/newGroup/newDiscordEveryoneRole";
import { groupResolver } from "./group/groupResolver";
import { groupInclude } from "./group/groupPrismaTypes";

import { createHatsGroup, newNftGroup } from "@/core/entity/group/newGroup/newNftGroup";
import { upsertBlockchainIdentity } from "./identity/newIdentity/upsertBlockchainIdentity";
import { upsertEmailIdentity } from "./identity/newIdentity/upsertEmailIdentity";

export const newEntities = async (
  args: MutationNewEntitiesArgs,
  context: GraphqlRequestContext,
): Promise<Entity[]> => {
  if (!context.currentUser) throw Error("ERROR Unauthenticated user");
  const agents = await Promise.all(
    args.entities.map(async (a) => {
      if (a.identityBlockchain) {
        return await upsertBlockchainIdentity({ newEntity: a, context });
      } else if (a.identityEmail) {
        return await upsertEmailIdentity({ newAgent: a, context });
      } else if (a.groupDiscordRole) {
        if (a.groupDiscordRole.roleId === "@everyone") {
          await newDiscordEveryoneRole({ serverId: a.groupDiscordRole.serverId, context });
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
          return groupResolver(group);
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
          return groupResolver(group);
        }
      } else if (a.groupNft) {
        return await newNftGroup({
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
