export const getFlowName = ({
  flowName,
  ownerGroupName,
  flowNameOverride,
}: {
  flowName: string;
  ownerGroupName?: string | undefined | null;
  flowNameOverride?: string;
}): string => {
  if (flowNameOverride) {
    return flowNameOverride;
  } else if (ownerGroupName) {
    return flowName + ` for ${ownerGroupName}`;
  } else {
    return flowName;
  }
};
