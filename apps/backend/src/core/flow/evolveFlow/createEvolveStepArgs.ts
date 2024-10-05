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

import { EvolveFlowFields } from "./EvolveFlowFields";

export const createEvolveStepArgs = (evolveArgs: EvolveFlowArgs): NewStepArgs => {
  const requestFieldSetArgs: FieldArgs[] = [
    {
      type: FieldType.FreeInput,
      fieldId: "proposed",
      freeInputDataType: FieldDataType.FlowVersionId,
      name: EvolveFlowFields.ProposedFlow,
      required: true,
    },
    {
      type: FieldType.FreeInput,
      fieldId: "current",
      freeInputDataType: FieldDataType.FlowVersionId,
      name: EvolveFlowFields.CurrentFlow,
      required: true,
    },
    {
      type: FieldType.FreeInput,
      fieldId: "description",
      freeInputDataType: FieldDataType.String,
      name: EvolveFlowFields.Description,
      required: false,
    },
  ];

  const responseFieldSetArgs: FieldArgs = {
    type: FieldType.Options,
    fieldId: "new",
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
    locked: true,
  };

  return {
    allowMultipleResponses: false,
    canBeManuallyEnded: false,
    request: {
      permission: evolveArgs.requestPermission,
      fields: requestFieldSetArgs,
      fieldsLocked: true,
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
