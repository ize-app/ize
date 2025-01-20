import {
  DecisionType,
  GroupFlowPolicyArgs,
  ResultArgs,
  ResultType,
} from "@/graphql/generated/resolver-types";

export const createDecisionResultArgsForPolicy = ({
  policy,
  fieldId,
}: {
  policy: GroupFlowPolicyArgs;
  fieldId: string;
}): ResultArgs => {
  policy.decision?.type;
  const decisionType = policy.decision?.type ?? DecisionType.NumberThreshold;

  const threshold =
    policy.decision?.threshold ?? (decisionType === DecisionType.NumberThreshold ? 2 : 51);

  const resultArgs: ResultArgs = {
    resultConfigId: crypto.randomUUID(),
    fieldId,
    type: ResultType.Decision,
    decision: { type: decisionType, threshold, conditions: [] },
  };
  return resultArgs;
};
