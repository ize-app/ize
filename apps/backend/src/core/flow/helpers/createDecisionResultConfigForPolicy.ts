import {
  DecisionType,
  GroupFlowPolicyArgs,
  GroupFlowPolicyType,
  ResultArgs,
  ResultType,
} from "@/graphql/generated/resolver-types";

export const createDecisionResultConfigForPolicy = ({
  policy,
}: {
  policy: GroupFlowPolicyArgs;
}): ResultArgs | undefined => {
  if (policy.type === GroupFlowPolicyType.GroupAutoApprove) return undefined;

  policy.decision?.type;
  const decisionType = policy.decision?.type ?? DecisionType.NumberThreshold;

  const threshold =
    policy.decision?.threshold ?? (decisionType === DecisionType.NumberThreshold ? 2 : 51);

  const resultArgs: ResultArgs = {
    type: ResultType.Decision,
    decision: { type: decisionType, threshold },
    responseFieldIndex: 0,
    minimumAnswers: 2,
  };
  return resultArgs;
};
