import {
  FieldArgs,
  FieldDataType,
  FieldOptionsSelectionType,
  FieldType,
  GroupFlowPolicyArgs,
  GroupFlowPolicyType,
  StepResponseArgs,
} from "@/graphql/generated/resolver-types";

export const createResponseConfigForPolicy = ({
  creatorEntityId,
  groupEntityId,
  policy,
}: {
  creatorEntityId: string;
  groupEntityId: string;
  policy: GroupFlowPolicyArgs;
}): StepResponseArgs | undefined => {
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

  if (policy.type === GroupFlowPolicyType.GroupAutoApprove) return undefined;

  return {
    fields: [responseApprovalFieldArgs],
    fieldsLocked: true,
    permission: {
      anyone: false,
      entities: [
        {
          id:
            policy.type === GroupFlowPolicyType.CreatorAutoApprove
              ? creatorEntityId
              : groupEntityId,
        },
      ],
    },
  };
};
