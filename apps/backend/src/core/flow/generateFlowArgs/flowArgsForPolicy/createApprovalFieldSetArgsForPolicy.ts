import {
  FieldArgs,
  FieldDataType,
  FieldOptionsSelectionType,
  FieldType,
  GroupFlowPolicyArgs,
  GroupFlowPolicyType,
} from "@/graphql/generated/resolver-types";

export const createApprovalFieldSetArgsForPolicy = ({
  policy,
}: {
  policy: GroupFlowPolicyArgs;
}): FieldArgs | undefined => {
  if (
    policy.type === GroupFlowPolicyType.CreatorAutoApprove ||
    policy.type === GroupFlowPolicyType.GroupAutoApprove
  )
    return undefined;

  const responseApprovalFieldArgs: FieldArgs = {
    type: FieldType.Options,
    fieldId: "new",
    isInternal: false,
    name: "Do you approve of these changes?",
    required: true,
    optionsConfig: {
      previousStepOptions: false,
      maxSelections: 1,
      selectionType: FieldOptionsSelectionType.Select,
      linkedResultOptions: [],
      options: [
        { optionId: "approve", dataType: FieldDataType.String, name: "✅" },
        { optionId: "deny", dataType: FieldDataType.String, name: "❌" },
      ],
    },
  };

  return responseApprovalFieldArgs;
};
