import { Prisma } from "@prisma/client";

import { groupResolver } from "@/core/entity/group/groupResolver";
import { Field, Flow, FlowType, ResultConfig } from "@/graphql/generated/resolver-types";
import { prisma } from "@/prisma/client";

import { stepResolver } from "./stepResolver";
import { FlowVersionPrismaType } from "../flowPrismaTypes";
import { getFlowName } from "../helpers/getFlowName";
import { isWatchedFlow } from "../helpers/isWatchedFlow";

export const flowResolver = async ({
  flowVersion,
  evolveFlow,
  userIdentityIds,
  userGroupIds,
  userId,
  flowNameOverride,
  hideSensitiveInfo = true,
  responseFieldsCache = [],
  resultConfigsCache = [],
  transaction = prisma,
}: {
  flowVersion: FlowVersionPrismaType;
  evolveFlow?: FlowVersionPrismaType;
  userIdentityIds: string[];
  userGroupIds: string[];
  userId: string | undefined;
  flowNameOverride?: string;
  responseFieldsCache?: Field[];
  resultConfigsCache?: ResultConfig[];
  hideSensitiveInfo?: boolean;
  transaction?: Prisma.TransactionClient;
}): Promise<Flow> => {
  return {
    __typename: "Flow",
    id: flowVersion.Flow.id,
    flowId: flowVersion.Flow.id,
    flowVersionId: flowVersion.id,
    group: flowVersion.Flow.OwnerGroup ? groupResolver(flowVersion.Flow.OwnerGroup) : null,
    currentFlowVersionId: flowVersion.Flow.currentFlowVersionId,
    createdAt: flowVersion.Flow.createdAt.toISOString(),
    versionCreatedAt: flowVersion.createdAt.toISOString(),
    versionPublishedAt: flowVersion.publishedAt && flowVersion.publishedAt.toISOString(),
    active: flowVersion.active,
    type: flowVersion.Flow.type as FlowType,
    reusable: flowVersion.reusable,
    isWatched: isWatchedFlow({ flowVersion: flowVersion, userId }),
    name: getFlowName({
      flowName: flowVersion.name,
      ownerGroupName: flowVersion.Flow.OwnerGroup?.GroupCustom?.name,
      flowNameOverride,
    }),
    flowsEvolvedByThisFlow: flowVersion.Flow.EvolveRightsForFlowVersions.filter(
      (fv) => fv.active && fv.Flow.type !== FlowType.Evolve,
    ).map((fv) => ({
      flowName: fv.name,
      flowId: fv.Flow.id,
    })),
    steps: flowVersion.Steps.map((step) =>
      stepResolver({
        step,
        userIdentityIds,
        userGroupIds,
        userId,
        responseFieldsCache,
        resultConfigsCache,
        hideSensitiveInfo,
      }),
    ).sort((a, b) => a.index - b.index),
    evolve: evolveFlow
      ? await flowResolver({
          flowVersion: evolveFlow,
          userIdentityIds,
          userGroupIds,
          userId,
          transaction,
        })
      : null,
  };
};
