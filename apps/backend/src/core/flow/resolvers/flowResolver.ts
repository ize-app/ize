import { Field, Flow, FlowType, ResultConfig } from "@/graphql/generated/resolver-types";
import { FlowVersionPrismaType } from "../flowPrismaTypes";
import { stepResolver } from "./stepResolver";

export const flowResolver = ({
  flowVersion,
  evolveFlow,
  userIdentityIds,
  userGroupIds,
  userId,
  responseFieldsCache = [],
  resultConfigsCache = [],
}: {
  flowVersion: FlowVersionPrismaType;
  evolveFlow?: FlowVersionPrismaType;
  userIdentityIds: string[];
  userGroupIds: string[];
  userId: string | undefined;
  responseFieldsCache?: Field[];
  resultConfigsCache?: ResultConfig[];
}): Flow => {
  return {
    __typename: "Flow",
    id: flowVersion.Flow.id,
    flowId: flowVersion.Flow.id,
    flowVersionId: flowVersion.id,
    currentFlowVersionId: flowVersion.Flow.currentFlowVersionId,
    createdAt: flowVersion.Flow.createdAt.toISOString(),
    versionCreatedAt: flowVersion.createdAt.toISOString(),
    versionPublishedAt: flowVersion.publishedAt && flowVersion.publishedAt.toISOString(),
    draft: flowVersion.draft,
    type: flowVersion.Flow.type as FlowType,
    reusable: flowVersion.reusable,
    name: flowVersion.name,
    steps: flowVersion.Steps.map((step) =>
      stepResolver({
        step,
        userIdentityIds,
        userGroupIds,
        userId,
        responseFieldsCache,
        resultConfigsCache,
      }),
    ).sort((a, b) => a.index - b.index),
    evolve: evolveFlow
      ? flowResolver({ flowVersion: evolveFlow, userIdentityIds, userGroupIds, userId })
      : null,
  };
};
