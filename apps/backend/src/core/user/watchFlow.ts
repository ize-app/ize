import { GraphQLError } from "graphql";

import { CustomErrorCodes } from "@/graphql/errors";
import { MutationWatchFlowArgs } from "@graphql/generated/resolver-types";

import { GraphqlRequestContext } from "../../graphql/context";
import { prisma } from "../../prisma/client";

export const watchFlow = async ({
  args,
  context,
}: {
  args: MutationWatchFlowArgs;
  context: GraphqlRequestContext;
}): Promise<boolean> => {
  if (!context.currentUser)
    throw new GraphQLError("Unauthenticated", {
      extensions: { code: CustomErrorCodes.Unauthenticated },
    });

  await prisma.usersWatchedFlows.upsert({
    where: {
      userId_flowId: {
        flowId: args.flowId,
        userId: context.currentUser.id,
      },
    },
    create: { flowId: args.flowId, userId: context.currentUser.id, watched: args.watch },
    update: { watched: args.watch },
  });
  return args.watch;
};
