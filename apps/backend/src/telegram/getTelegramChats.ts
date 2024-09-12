import { entityInclude } from "@/core/entity/entityPrismaTypes";
import { entityResolver } from "@/core/entity/entityResolver";
import { GraphqlRequestContext } from "@/graphql/context";
import { CustomErrorCodes, GraphQLError } from "@/graphql/errors";
import { Entity } from "@/graphql/generated/resolver-types";
import { prisma } from "@/prisma/client";

// Returns groups that user has admin rights to
// TODO: adminTelegramUserId doesn't pull exhaustive list of Telegram chats. Need to start logging admins in the database
export const getTelegramChats = async ({
  context,
}: {
  context: GraphqlRequestContext;
}): Promise<Entity[]> => {
  if (!context.currentUser)
    throw new GraphQLError("Unauthenticated", {
      extensions: { code: CustomErrorCodes.Unauthenticated },
    });

  const telegramIdentity = context.currentUser.Identities.find((id) => !!id.IdentityTelegram);

  if (!telegramIdentity?.IdentityTelegram) return [];

  const telegramUserId = telegramIdentity.IdentityTelegram.telegramUserId;

  const telegramIzeBots = await prisma.entity.findMany({
    include: entityInclude,
    where: {
      Group: {
        // this only pulls groups where user was last admin to call /linkgroup telegram command
        GroupTelegramChat: { adminTelegramUserId: telegramUserId },
      },
    },
  });

  return telegramIzeBots.map((entity) => {
    return entityResolver({ entity, userIdentityIds: [] });
  });
};
