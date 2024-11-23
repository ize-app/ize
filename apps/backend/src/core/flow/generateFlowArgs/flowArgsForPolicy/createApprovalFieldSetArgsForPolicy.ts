import {
  FieldArgs,
  FieldDataType,
  FieldType,
  GroupFlowPolicyArgs,
  GroupFlowPolicyType,
  OptionSelectionType,
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
    type: FieldType.Options,
    fieldId: crypto.randomUUID(),
    isInternal: false,
    name: "Do you approve of these changes?",
    required: true,
    optionsConfig: {
      previousStepOptions: false,
      maxSelections: 1,
      selectionType: OptionSelectionType.Select,
      linkedResultOptions: [],
      options: [
        { optionId: approveOptionId, dataType: FieldDataType.String, name: "✅" },
        { optionId: crypto.randomUUID(), dataType: FieldDataType.String, name: "❌" },
      ],
    },
  };

  return [responseApprovalFieldArgs, approveOptionId];
};
