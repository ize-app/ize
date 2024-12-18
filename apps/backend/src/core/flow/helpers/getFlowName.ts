import { FlowType } from "@prisma/client";

export const getFlowName = ({
  flowName,
  ownerGroupName,
  flowType,
  flowNameOverride,
}: {
  flowName: string;
  flowType: FlowType;
  ownerGroupName?: string | undefined | null;
  flowNameOverride?: string;
}): string => {
  if (flowNameOverride) {
    return flowNameOverride;
  }
  switch (flowType) {
    case FlowType.EvolveGroup:
      return `Evolve group: '${ownerGroupName}'`;
      break;
    case FlowType.GroupWatchFlow:
      return `Edit watched flows of group: '${ownerGroupName}'`;
      break;
    default:
      return flowName;
  }
};
