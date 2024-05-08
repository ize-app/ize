import { Flow, QueryGetFlowArgs } from "@/graphql/generated/resolver-types";
import { prisma } from "../../prisma/client";
import { flowInclude } from "./flowPrismaTypes";
import { flowResolver } from "./resolvers/flowResolver";
import { GraphQLError, ApolloServerErrorCode } from "@graphql/errors";
import { MePrismaType } from "../user/userPrismaTypes";
import { getGroupIdsOfUser } from "../entity/group/getGroupIdsOfUser";

export const getFlow = async ({
  args,
  user,
}: {
  args: QueryGetFlowArgs;
  user: MePrismaType | undefined | null;
}): Promise<Flow> => {
  const flow = await prisma.flow.findFirstOrThrow({
    include: flowInclude,
    where: {
      id: args.flowId,
      FlowVersions: args.flowVersionId
        ? {
            some: { id: args.flowVersionId },
          }
        : {},
    },
  });

  if (!flow.CurrentFlowVersion?.evolveFlowId)
    throw new GraphQLError("Missing evolve flow for flow.", {
      extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
    });

  const evolveFlow = await prisma.flow.findFirstOrThrow({
    include: flowInclude,
    where: {
      id: flow.CurrentFlowVersion?.evolveFlowId,
    },
  });

  const userIdentityIds = user?.Identities.map((id) => id.id) ?? [];

  const userGroupIds = await getGroupIdsOfUser({ user });

  const res = flowResolver({
    flowVersion: flow.CurrentFlowVersion,
    evolveFlow: evolveFlow.CurrentFlowVersion ?? undefined,
    userIdentityIds,
    userGroupIds,
    userId: user?.id,
  });

  return res;
};
