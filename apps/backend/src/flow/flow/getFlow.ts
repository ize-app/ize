import { Flow, QueryGetFlowArgs } from "@/graphql/generated/resolver-types";
import { prisma } from "../../prisma/client";
import { flowInclude } from "./types";
import { flowResolver } from "./resolvers";
import { GraphQLError, ApolloServerErrorCode } from "@graphql/errors";
import { GraphqlRequestContext } from "@graphql/context";
import { MePrismaType } from "@/utils/formatUser";

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
      id: args.processId,
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

  return flowResolver({ flow, evolveFlow, user });
};
