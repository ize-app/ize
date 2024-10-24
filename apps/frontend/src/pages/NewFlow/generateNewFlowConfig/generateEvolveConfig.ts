import { ActionSchemaType } from "@/components/Form/FlowForm/formValidation/action";
import {
  DefaultOptionSelection,
  FieldSchemaType,
} from "@/components/Form/FlowForm/formValidation/fields";
import { FlowSchemaType } from "@/components/Form/FlowForm/formValidation/flow";
import { PermissionSchemaType } from "@/components/Form/FlowForm/formValidation/permission";
import { ResultSchemaType } from "@/components/Form/FlowForm/formValidation/result";
import {
  ActionType,
  DecisionType,
  FieldDataType,
  FieldOptionsSelectionType,
  FieldType,
  ResultType,
} from "@/graphql/generated/graphql";

export enum EvolveFlowFields {
  ProposedFlow = "Proposed flow",
  CurrentFlow = "Current flow",
  Description = "Description",
}

const requestFieldSetArgs: FieldSchemaType[] = [
  {
    type: FieldType.FreeInput,
    fieldId: crypto.randomUUID(),
    isInternal: false,
    freeInputDataType: FieldDataType.FlowVersionId,
    name: EvolveFlowFields.ProposedFlow,
    required: true,
  },
  {
    type: FieldType.FreeInput,
    fieldId: crypto.randomUUID(),
    isInternal: false,
    freeInputDataType: FieldDataType.FlowVersionId,
    name: EvolveFlowFields.CurrentFlow,
    required: true,
  },
  {
    type: FieldType.FreeInput,
    fieldId: crypto.randomUUID(),
    isInternal: false,
    freeInputDataType: FieldDataType.String,
    name: EvolveFlowFields.Description,
    required: false,
  },
];

export const generateEvolveConfig = ({
  permission,
}: {
  permission: PermissionSchemaType;
}): FlowSchemaType => {
  const responseField: FieldSchemaType = {
    type: FieldType.Options,
    fieldId: crypto.randomUUID(),
    isInternal: false,
    name: "Do you approve of these changes?",
    required: true,
    optionsConfig: {
      previousStepOptions: false,
      maxSelections: 1,
      selectionType: FieldOptionsSelectionType.Select,
      linkedResultOptions: [],
      options: [
        { optionId: crypto.randomUUID(), dataType: FieldDataType.String, name: "✅" },
        { optionId: crypto.randomUUID(), dataType: FieldDataType.String, name: "❌" },
      ],
    },
  };

  const resultArgs: ResultSchemaType = {
    resultId: crypto.randomUUID(),
    type: ResultType.Decision,
    decision: {
      type: DecisionType.NumberThreshold,
      threshold: 1,
      defaultOptionId: DefaultOptionSelection.None,
    },
    fieldId: responseField.fieldId,
    minimumAnswers: 1,
  };

  const actionArgs: ActionSchemaType = {
    type: ActionType.EvolveFlow,
    filterOptionId: responseField.optionsConfig.options[0].optionId,
    locked: true,
  };

  const step = {
    fieldSet: { fields: [responseField], locked: true },
    response: {
      permission,
      expirationSeconds: 259200,
      allowMultipleResponses: false,
      canBeManuallyEnded: false,
    },
    result: [resultArgs],
    action: actionArgs,
  };

  return {
    name: "Evolve flow",
    fieldSet: {
      locked: true,
      fields: requestFieldSetArgs,
    },
    trigger: {
      permission,
    },
    steps: [step],
  };
};
