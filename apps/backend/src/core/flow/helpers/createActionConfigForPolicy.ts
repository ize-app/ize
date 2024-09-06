import {
  ActionArgs,
  ActionType,
  GroupFlowPolicyArgs,
  GroupFlowPolicyType,
} from "@/graphql/generated/resolver-types";

export const createActionConfigForPolicy = ({
  actionType,
  policy,
}: {
  actionType: ActionType;
  policy: GroupFlowPolicyArgs;
}): ActionArgs | undefined => {
  const actionArgs: ActionArgs = {
    type: actionType,
    filterResponseFieldIndex: policy.type === GroupFlowPolicyType.GroupAutoApprove ? undefined : 0,
    filterOptionIndex: policy.type === GroupFlowPolicyType.GroupAutoApprove ? undefined : 0,
    locked: true,
  };

  return actionArgs;
};
