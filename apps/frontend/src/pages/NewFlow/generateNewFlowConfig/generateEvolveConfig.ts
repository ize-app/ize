import { ActionSchemaType } from "@/components/Form/FlowForm/formValidation/action";
import { FieldSchemaType } from "@/components/Form/FlowForm/formValidation/fields";
import { FlowSchemaType, StepSchemaType } from "@/components/Form/FlowForm/formValidation/flow";
import { PermissionSchemaType } from "@/components/Form/FlowForm/formValidation/permission";
import { ResultSchemaType } from "@/components/Form/FlowForm/formValidation/result";
import {
  ActionType,
  DecisionType,
  FlowType,
  OptionSelectionType,
  ResultType,
  SystemFieldType,
  ValueType,
} from "@/graphql/generated/graphql";

const getRequestFieldSetArgs = (): FieldSchemaType[] => {
  return [
    {
      type: ValueType.FlowVersion,
      fieldId: crypto.randomUUID(),
      isInternal: false,
      systemType: SystemFieldType.EvolveFlowProposed,
      name: "Proposed flow",
      required: true,
    },
    {
      type: ValueType.FlowVersion,
      fieldId: crypto.randomUUID(),
      isInternal: false,
      systemType: SystemFieldType.EvolveFlowCurrent,
      name: "Current flow",
      required: true,
    },
    {
      type: ValueType.String,
      fieldId: crypto.randomUUID(),
      isInternal: false,
      systemType: SystemFieldType.EvolveFlowDescription,
      name: "Description of changes",
      required: false,
    },
  ];
};

export const generateEvolveConfig = ({
  triggerPermission,
  respondPermission,
}: {
  triggerPermission: PermissionSchemaType;
  respondPermission: PermissionSchemaType;
}): FlowSchemaType => {
  const approvalOptionId = crypto.randomUUID();
  const responseField: FieldSchemaType = {
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
        {
          optionId: approvalOptionId,
          input: { type: ValueType.String, value: "✅", required: true },
        },
        {
          optionId: crypto.randomUUID(),
          input: { type: ValueType.String, value: "❌", required: true },
        },
      ],
    },
  };

  const resultArgs: ResultSchemaType = {
    resultConfigId: crypto.randomUUID(),
    type: ResultType.Decision,
    decision: {
      type: DecisionType.NumberThreshold,
      threshold: 1,
      defaultDecision: {
        hasDefault: false,
        optionId: null,
      },
      conditions: [],
    },
    fieldId: responseField.fieldId,
  };

  const actionArgs: ActionSchemaType = {
    type: ActionType.EvolveFlow,
    filter: {
      resultConfigId: resultArgs.resultConfigId,
      optionId: approvalOptionId,
    },
    locked: true,
  };

  const step: StepSchemaType = {
    stepId: crypto.randomUUID(),
    fieldSet: { fields: [responseField], locked: false },
    response: {
      permission: respondPermission,
      expirationSeconds: 259200,
      allowMultipleResponses: false,
      canBeManuallyEnded: false,
      minResponses: 1,
    },
    result: [resultArgs],
    action: actionArgs,
  };

  return {
    flowVersionId: crypto.randomUUID(),
    type: FlowType.Evolve,
    name: "Evolve flow",
    fieldSet: {
      locked: true,
      fields: getRequestFieldSetArgs(),
    },
    trigger: {
      permission: triggerPermission,
    },
    steps: [step],
  };
};
