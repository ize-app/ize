import { FlowType, FlowVersion } from "@prisma/client";

import { GroupPrismaType } from "@/core/entity/group/groupPrismaTypes";
import { FlowReference } from "@/graphql/generated/resolver-types";

import { getFlowName } from "../helpers/getFlowName";

export const flowReferenceResolver = ({
  flowId,
  flowType,
  flowVersionName,
  flowVersionId,
  group,
}: {
  flowId: string;
  flowType: FlowType;
  group: GroupPrismaType | null;
  flowVersionName: string;
  flowVersionId: string;
}): FlowReference => {
  return {
    __typename: "FlowReference",
    flowName: getFlowName({
      flowName: flowVersionName,
      flowType,
      ownerGroupName: group?.GroupIze?.name,
    }),
    flowId,
    flowVersionId: flowVersionId,
  };
};
