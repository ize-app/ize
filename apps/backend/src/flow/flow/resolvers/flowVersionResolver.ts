import { Flow, FlowType } from "@/graphql/generated/resolver-types";
import { FlowVersionPrismaType } from "../flowPrismaTypes";
import { stepResolver } from "./stepResolver";

export const flowVersionResolver = ({
  flowVersion,
  evolveFlow,
  userIdentityIds,
  userGroupIds,
  userId,
}: {
  flowVersion: FlowVersionPrismaType;
  evolveFlow?: FlowVersionPrismaType;
  userIdentityIds: string[];
  userGroupIds: string[];
  userId: string | undefined;
}): Flow => {
  return {
    __typename: "Flow",
    flowId: flowVersion.Flow.id,
    flowVersionId: flowVersion.id,
    type: flowVersion.Flow.type as FlowType,
    reusable: flowVersion.reusable,
    name: flowVersion.name,
    steps: flowVersion.Steps.map((step) =>
      stepResolver({ step, userIdentityIds, userGroupIds, userId }),
    ).sort((a, b) => a.index - b.index),
    evolve: evolveFlow
      ? flowVersionResolver({ flowVersion: evolveFlow, userIdentityIds, userGroupIds, userId })
      : null,
  };
};
