import { GraphqlRequestContext } from "@/graphql/context";
import { Flow, QueryGetFlowArgs } from "@/graphql/generated/resolver-types";
import { ApolloServerErrorCode, GraphQLError } from "@graphql/errors";

import {
  FlowVersionPrismaType,
  createFlowInclude,
  createFlowVersionInclude,
} from "./flowPrismaTypes";
import { flowResolver } from "./resolvers/flowResolver";
import { prisma } from "../../prisma/client";
import { getGroupIdsOfUser } from "../entity/group/getGroupIdsOfUser";

// if flowID is provided, it returns current published version of that flow
// if flowVersionID is provided, it returns that specific version/draft of the flow
export const getFlow = async ({
  args,
  context,
}: {
  args: QueryGetFlowArgs;
  context: GraphqlRequestContext;
}): Promise<Flow> => {
  let flowVersion: FlowVersionPrismaType | null;

  if (args.flowId) {
    const flow = await prisma.flow.findFirstOrThrow({
      include: createFlowInclude(context.currentUser?.id),
      where: {
        id: args.flowId,
        reusable: true,
        FlowVersions: args.flowVersionId
          ? {
              some: { id: args.flowVersionId },
            }
          : undefined,
      },
    });

    flowVersion = flow.CurrentFlowVersion;
  } else if (args.flowVersionId) {
    flowVersion = await prisma.flowVersion.findFirstOrThrow({
      include: createFlowVersionInclude(context.currentUser?.id),
      where: {
        id: args.flowVersionId,
      },
    });
  } else {
    throw new GraphQLError("Missing both a flowID and flowversionID", {
      extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
    });
  }

  if (!flowVersion)
    throw new GraphQLError(
      `Cannot find flow version for flow ${args.flowId ?? ""} and flowVersionId ${
        args.flowVersionId ?? ""
      }`,
      {
        extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
      },
    );

  if (!flowVersion.evolveFlowId)
    throw new GraphQLError("Missing evolve flow for flow.", {
      extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
    });

  const evolveFlow = await prisma.flow.findFirstOrThrow({
    include: createFlowInclude(context.currentUser?.id),
    where: {
      id: flowVersion.evolveFlowId,
    },
  });

  const userIdentityIds = context.currentUser?.Identities.map((id) => id.id) ?? [];

  const userGroupIds = await getGroupIdsOfUser({ user: context.currentUser });

  const res = await flowResolver({
    flowVersion: flowVersion,
    evolveFlow: evolveFlow.CurrentFlowVersion ?? undefined,
    userIdentityIds,
    userGroupIds,
    context,
    userId: context.currentUser?.id,
  });

  return res;
};
