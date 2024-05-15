import {
  ActionArgs,
  ActionType,
  EvolveFlowArgs,
  FieldArgs,
  FieldDataType,
  FieldOptionsSelectionType,
  FieldType,
  NewStepArgs,
  ResultArgs,
  ResultType,
} from "@/graphql/generated/resolver-types";

export const createEvolveStepArgs = (evolveArgs: EvolveFlowArgs): NewStepArgs => {
  const requestFieldSetArgs: FieldArgs = {
    type: FieldType.FreeInput,
    fieldId: "new",
    freeInputDataType: FieldDataType.String,
    name: "Purpose of changes",
    required: true,
  };

  const responseFieldSetArgs: FieldArgs = {
    type: FieldType.Options,
    fieldId: "new",
    name: "Do you approve of these changes?",
    required: true,
    optionsConfig: {
      hasRequestOptions: false,
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

  const resultArgs: ResultArgs = {
    type: ResultType.Decision,
    decision: { ...evolveArgs.decision },
    responseFieldIndex: 0,
    minimumAnswers: 1,
  };

  const actionArgs: ActionArgs = {
    type: ActionType.EvolveFlow,
    filterResponseFieldIndex: 0,
    filterOptionIndex: 0,
  };

  return {
    allowMultipleResponses: false,
    request: {
      permission: evolveArgs.requestPermission,
      fields: [requestFieldSetArgs],
    },
    response: {
      permission: evolveArgs.responsePermission,
      fields: [responseFieldSetArgs],
    },
    expirationSeconds: 259200,
    result: [resultArgs],
    action: actionArgs,
  };
};
