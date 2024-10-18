import {
  ActionArgs,
  ActionType,
  EvolveFlowArgs,
  FieldArgs,
  FieldDataType,
  FieldOptionsSelectionType,
  FieldType,
  NewFlowArgs,
  NewStepArgs,
  ResultArgs,
  ResultType,
} from "@/graphql/generated/resolver-types";

import { EvolveFlowFields } from "./EvolveFlowFields";

const requestFieldSetArgs: FieldArgs[] = [
  {
    type: FieldType.FreeInput,
    fieldId: "proposed",
    isInternal: false,
    freeInputDataType: FieldDataType.FlowVersionId,
    name: EvolveFlowFields.ProposedFlow,
    required: true,
  },
  {
    type: FieldType.FreeInput,
    fieldId: "current",
    isInternal: false,
    freeInputDataType: FieldDataType.FlowVersionId,
    name: EvolveFlowFields.CurrentFlow,
    required: true,
  },
  {
    type: FieldType.FreeInput,
    fieldId: "description",
    isInternal: false,
    freeInputDataType: FieldDataType.String,
    name: EvolveFlowFields.Description,
    required: false,
  },
];

export const createEvolveFlowFlowArgs = (evolveArgs: EvolveFlowArgs): NewFlowArgs => {
  return {
    reusable: true,
    name: "Evolve flow",
    fieldSet: {
      locked: true,
      fields: requestFieldSetArgs,
    },
    trigger: {
      permission: evolveArgs.requestPermission,
    },
    steps: [createEvolveStepArgs(evolveArgs)],
  };
};

const createEvolveStepArgs = (evolveArgs: EvolveFlowArgs): NewStepArgs => {
  const responseFieldSetArgs: FieldArgs = {
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
    fieldSet: { fields: [responseFieldSetArgs], locked: true },
    response: {
      permission: evolveArgs.responsePermission,
      expirationSeconds: 259200,
      allowMultipleResponses: false,
      canBeManuallyEnded: false,
    },
    result: [resultArgs],
    action: actionArgs,
  };
};
