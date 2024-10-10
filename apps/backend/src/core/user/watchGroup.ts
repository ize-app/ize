import { GraphQLError } from "graphql";

import { CustomErrorCodes } from "@/graphql/errors";
import { MutationWatchGroupArgs } from "@graphql/generated/resolver-types";

import { GraphqlRequestContext } from "../../graphql/context";
import { prisma } from "../../prisma/client";

// for a user to watch a group
export const watchGroup = async ({
  args,
  context,
}: {
  args: MutationWatchGroupArgs;
  context: GraphqlRequestContext;
}): Promise<boolean> => {
  if (!context.currentUser)
    throw new GraphQLError("Unauthenticated", {
      extensions: { code: CustomErrorCodes.Unauthenticated },
    });

  await prisma.entityWatchedGroups.upsert({
    where: {
      entityId_groupId: {
        groupId: args.groupId,
        entityId: context.currentUser.entityId,
      },
    },
    create: { groupId: args.groupId, entityId: context.currentUser.entityId, watched: args.watch },
    update: { watched: args.watch },
  });
  return args.watch;
};
