import { Flow, QueryGetFlowArgs } from "@/graphql/generated/resolver-types";
import { prisma } from "../../prisma/client";
import { flowInclude } from "./types";
import { flowResolver } from "./resolvers";
import { GraphQLError, ApolloServerErrorCode } from "@graphql/errors";
import { MePrismaType } from "@/utils/formatUser";
import { getGroupIdsOfUser } from "../group/getGroupIdsOfUser";

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

  return flowResolver({ flow, evolveFlow, userIdentityIds, userGroupIds });
};
