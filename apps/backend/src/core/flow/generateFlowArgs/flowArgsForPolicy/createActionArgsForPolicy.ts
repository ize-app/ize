import {
  ActionArgs,
  ActionType,
  GroupFlowPolicyArgs,
  GroupFlowPolicyType,
} from "@/graphql/generated/resolver-types";

export const createActionArgsForPolicy = ({
  actionType,
  policy,
}: {
  actionType: ActionType;
  policy: GroupFlowPolicyArgs;
}): ActionArgs | undefined => {
  const actionArgs: ActionArgs = {
    type: actionType,
    filterResponseFieldIndex: policy.type === GroupFlowPolicyType.GroupDecision ? 0 : undefined,
    filterOptionIndex: policy.type === GroupFlowPolicyType.GroupDecision ? 0 : undefined,
    locked: true,
  };

  return actionArgs;
};
