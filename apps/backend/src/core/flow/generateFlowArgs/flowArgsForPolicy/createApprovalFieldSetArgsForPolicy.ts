import {
  FieldArgs,
  GroupFlowPolicyArgs,
  GroupFlowPolicyType,
  OptionSelectionType,
  ValueType,
} from "@/graphql/generated/resolver-types";

export const createApprovalFieldSetArgsForPolicy = ({
  policy,
}: {
  policy: GroupFlowPolicyArgs;
}): [FieldArgs, string] | undefined => {
  if (
    policy.type === GroupFlowPolicyType.CreatorAutoApprove ||
    policy.type === GroupFlowPolicyType.GroupAutoApprove
  )
    return undefined;

  const approveOptionId = crypto.randomUUID();

  const responseApprovalFieldArgs: FieldArgs = {
    type: ValueType.OptionSelections,
    fieldId: crypto.randomUUID(),
    isInternal: false,
    name: "Do you approve of these changes?",
    required: true,
    optionsConfig: {
      maxSelections: 1,
      selectionType: OptionSelectionType.Select,
      linkedResultOptions: [],
      options: [
        { optionId: approveOptionId, type: ValueType.String, value: JSON.stringify("✅") },
        { optionId: crypto.randomUUID(), type: ValueType.String, value: JSON.stringify("❌") },
      ],
    },
  };

  return [responseApprovalFieldArgs, approveOptionId];
};
