import { Flow, QueryGetFlowArgs } from "@/graphql/generated/resolver-types";
import { ApolloServerErrorCode, CustomErrorCodes, GraphQLError } from "@graphql/errors";

import {
  FlowVersionPrismaType,
  createFlowInclude,
  createFlowVersionInclude,
} from "./flowPrismaTypes";
import { flowResolver } from "./resolvers/flowResolver";
import { prisma } from "../../prisma/client";
import { getGroupIdsOfUser } from "../entity/group/getGroupIdsOfUser";
import { hasWritePermission } from "../permission/hasWritePermission";
import { MePrismaType } from "../user/userPrismaTypes";

// if flowID is provided, it returns current published version of that flow
// if flowVersionID is provided, it returns that specific version/draft of the flow
export const getFlow = async ({
  args,
  user,
}: {
  args: QueryGetFlowArgs;
  user: MePrismaType | undefined | null;
}): Promise<Flow> => {
  let flowVersion: FlowVersionPrismaType | null;

  if (args.flowId) {
    const flow = await prisma.flow.findFirstOrThrow({
      include: createFlowInclude(user?.id),
      where: {
        id: args.flowId,
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
      include: createFlowVersionInclude(user?.id),
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
    include: createFlowInclude(user?.id),
    where: {
      id: flowVersion.evolveFlowId,
    },
  });

  if (args.isForEvolveRequest) {
    const evolveRequestPermissions = evolveFlow.CurrentFlowVersion?.Steps[0].RequestPermissions;
    if (!evolveRequestPermissions)
      throw new GraphQLError("Missing request permissions for evolve flow", {
        extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
      });

    const hasEvolvePermission = await hasWritePermission({
      permission: evolveRequestPermissions,
      context: { currentUser: user },
      transaction: prisma,
    });

    if (!hasEvolvePermission)
      throw new GraphQLError("Unauthenticated", {
        extensions: { code: CustomErrorCodes.Unauthenticated },
      });
  }

  const userIdentityIds = user?.Identities.map((id) => id.id) ?? [];

  const userGroupIds = await getGroupIdsOfUser({ user });

  const res = await flowResolver({
    flowVersion: flowVersion,
    evolveFlow: evolveFlow.CurrentFlowVersion ?? undefined,
    userIdentityIds,
    userGroupIds,
    userId: user?.id,
  });

  return res;
};
