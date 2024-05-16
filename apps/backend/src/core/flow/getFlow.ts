import { Flow, QueryGetFlowArgs } from "@/graphql/generated/resolver-types";
import { prisma } from "../../prisma/client";
import { flowInclude } from "./flowPrismaTypes";
import { flowResolver } from "./resolvers/flowResolver";
import { GraphQLError, ApolloServerErrorCode } from "@graphql/errors";
import { MePrismaType } from "../user/userPrismaTypes";
import { getGroupIdsOfUser } from "../entity/group/getGroupIdsOfUser";

// if flowID is provided, it returns current published version of that flow
// if flowVersionID is provided, it returns that specific version/draft of the flow
export const getFlow = async ({
  args,
  user,
}: {
  args: QueryGetFlowArgs;
  user: MePrismaType | undefined | null;
}): Promise<Flow> => {
  if (!args.flowId && !args.flowVersionId)
    throw new GraphQLError("Missing both a flowID and flowversionID", {
      extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
    });
    
  const flow = await prisma.flow.findFirstOrThrow({
    include: flowInclude,
    where: {
      id: args.flowId ? args.flowId : undefined,
      FlowVersions: args.flowVersionId
        ? {
            some: { id: args.flowVersionId },
          }
        : undefined,
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
