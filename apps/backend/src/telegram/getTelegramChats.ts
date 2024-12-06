import { EntityPrismaType, entityInclude } from "@/core/entity/entityPrismaTypes";
import { entityResolver } from "@/core/entity/entityResolver";
import { GraphqlRequestContext } from "@/graphql/context";
import { CustomErrorCodes, GraphQLError } from "@/graphql/errors";
import { Entity, QueryTelegramChatsArgs } from "@/graphql/generated/resolver-types";
import { prisma } from "@/prisma/client";

// Returns groups that user has admin rights to
// TODO: adminTelegramUserId doesn't pull exhaustive list of Telegram chats. Need to start logging admins in the database
export const getTelegramChats = async ({
  context,
  args,
}: {
  context: GraphqlRequestContext;
  args: QueryTelegramChatsArgs;
}): Promise<Entity[]> => {
  if (!context.currentUser)
    throw new GraphQLError("Unauthenticated", {
      extensions: { code: CustomErrorCodes.Unauthenticated },
    });

  const telegramIdentity = context.currentUser.Identities.find((id) => !!id.IdentityTelegram);

  if (!telegramIdentity?.IdentityTelegram) return [];

  const telegramUserId = telegramIdentity.IdentityTelegram.telegramUserId;

  let telegramIzeBots: EntityPrismaType[] = [];

  // used for setting up a new bot
  if (args.adminOnly) {
    telegramIzeBots = await prisma.entity.findMany({
      include: entityInclude,
      where: {
        NotifiesForIzeGroups: {
          none: {},
        },
        Group: {
          // this only pulls groups where user was last admin to call /linkgroup telegram command
          GroupTelegramChat: {
            id: { not: undefined },
            adminTelegramUserId: args.adminOnly ? { equals: telegramUserId } : {},
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  } else {
    telegramIzeBots = await prisma.entity.findMany({
      include: entityInclude,
      where: {
        Group: {
          EntitiesInGroup: {
            some: {
              entityId: telegramIdentity.entityId,
              active: true,
            },
          },
          GroupTelegramChat: {
            id: { not: undefined },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  return telegramIzeBots.map((entity) => {
    return entityResolver({ entity, userIdentityIds: [] });
  });
};
