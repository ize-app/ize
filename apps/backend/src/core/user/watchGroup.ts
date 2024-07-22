import { GraphQLError } from "graphql";

import { CustomErrorCodes } from "@/graphql/errors";
import { MutationWatchGroupArgs } from "@graphql/generated/resolver-types";

import { GraphqlRequestContext } from "../../graphql/context";
import { prisma } from "../../prisma/client";

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

  await prisma.usersWatchedGroups.upsert({
    where: {
      userId_groupId: {
        groupId: args.groupId,
        userId: context.currentUser.id,
      },
    },
    create: { groupId: args.groupId, userId: context.currentUser.id, watched: args.watch },
    update: { watched: args.watch },
  });
  return args.watch;
};
