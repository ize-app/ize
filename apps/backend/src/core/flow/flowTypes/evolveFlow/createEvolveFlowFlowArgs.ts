import { systemFieldDefaults } from "@/core/fields/systemFieldDefaults";
import {
  ActionArgs,
  ActionType,
  DecisionType,
  FieldArgs,
  FieldDataType,
  FieldOptionsSelectionType,
  FieldType,
  FlowType,
  NewFlowArgs,
  NewStepArgs,
  ResultArgs,
  ResultType,
  SystemFieldType,
} from "@/graphql/generated/resolver-types";

const requestFieldSetArgs: FieldArgs[] = [
  systemFieldDefaults[SystemFieldType.EvolveFlowProposed],
  systemFieldDefaults[SystemFieldType.EvolveFlowCurrent],
  systemFieldDefaults[SystemFieldType.EvolveFlowDescription],
];

export const createEvolveFlowFlowArgs = ({
  groupEntityId,
  creatorEntityId,
}: {
  groupEntityId: string;
  creatorEntityId: string;
}): NewFlowArgs => {
  return {
    type: FlowType.Evolve,
    name: "Evolve flow",
    fieldSet: {
      locked: true,
      fields: requestFieldSetArgs,
    },
    trigger: {
      permission: { anyone: false, entities: [{ id: groupEntityId }] },
    },
    steps: [createEvolveStepArgs(creatorEntityId)],
  };
};

const createEvolveStepArgs = (creatorEntityId: string): NewStepArgs => {
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
    decision: { type: DecisionType.NumberThreshold, threshold: 1, defaultOptionIndex: null },
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
    fieldSet: { fields: [responseFieldSetArgs], locked: false },
    response: {
      permission: { anyone: false, entities: [{ id: creatorEntityId }] },
      expirationSeconds: 259200,
      allowMultipleResponses: false,
      canBeManuallyEnded: false,
    },
    result: [resultArgs],
    action: actionArgs,
  };
};
