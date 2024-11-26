import { createSystemFieldDefaults } from "@/core/fields/createSystemFieldDefaults";
import {
  ActionArgs,
  ActionType,
  DecisionType,
  FieldArgs,
  FieldDataType,
  FieldType,
  FlowType,
  NewFlowArgs,
  NewStepArgs,
  OptionSelectionType,
  ResultArgs,
  ResultType,
  SystemFieldType,
} from "@/graphql/generated/resolver-types";

// const requestFieldSetArgs: FieldArgs[] = [
//   createSystemFieldDefaults(SystemFieldType.EvolveFlowProposed),
//   createSystemFieldDefaults(SystemFieldType.EvolveFlowCurrent),
//   createSystemFieldDefaults(SystemFieldType.EvolveFlowDescription),
// ];

export const createEvolveFlowFlowArgs = ({
  groupEntityId,
  creatorEntityId,
}: {
  groupEntityId: string;
  creatorEntityId: string;
}): NewFlowArgs => {
  return {
    flowVersionId: crypto.randomUUID(),
    type: FlowType.Evolve,
    name: "Evolve flow",
    fieldSet: {
      locked: true,
      fields: [
        createSystemFieldDefaults(SystemFieldType.EvolveFlowProposed),
        createSystemFieldDefaults(SystemFieldType.EvolveFlowCurrent),
        createSystemFieldDefaults(SystemFieldType.EvolveFlowDescription),
      ],
    },
    trigger: {
      permission: { anyone: false, entities: [{ id: groupEntityId }] },
    },
    steps: [createEvolveStepArgs(creatorEntityId)],
  };
};

const createEvolveStepArgs = (creatorEntityId: string): NewStepArgs => {
  const approveOptionId = crypto.randomUUID();
  const responseFieldSetArgs: FieldArgs = {
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

  const resultArgs: ResultArgs = {
    resultConfigId: crypto.randomUUID(),
    fieldId: responseFieldSetArgs.fieldId,
    type: ResultType.Decision,
    decision: { type: DecisionType.NumberThreshold, threshold: 1, defaultOptionId: null },
  };

  const actionArgs: ActionArgs = {
    type: ActionType.EvolveFlow,
    filter: {
      resultConfigId: resultArgs.resultConfigId,
      optionId: approveOptionId,
    },
    locked: true,
  };

  return {
    stepId: crypto.randomUUID(),
    fieldSet: { fields: [responseFieldSetArgs], locked: false },
    response: {
      permission: { anyone: false, entities: [{ id: creatorEntityId }] },
      expirationSeconds: 259200,
      allowMultipleResponses: false,
      canBeManuallyEnded: false,
      minResponses: 1,
    },
    result: [resultArgs],
    action: actionArgs,
  };
};
