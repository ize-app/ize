import { FlowSchemaType, StepSchemaType } from "../formValidation/flow";

import { PermissionType } from "../formValidation/permission";
import {
  ActionNewType,
  DecisionType,
  FieldDataType,
  FieldOptionsSelectionType,
  FieldType,
  ResultType,
} from "@/graphql/generated/graphql";
import { LlmSummaryType } from "../formValidation/result";

export const getDefaultFormValues = (resultType: ResultType | null): StepSchemaType => {
  console.log("getting default form values for ", resultType);
  switch (resultType) {
    case ResultType.Decision:
      return structuredClone(defaultDecisionStepFormValues);
    case ResultType.LlmSummary:
      return structuredClone(defaultLlmSummaryStepFormValues);
    default:
      return {};
  }
};

export const defaultDecisionStepFormValues: StepSchemaType = {
  request: {
    permission: { type: PermissionType.Anyone },
    fields: [],
  },
  response: {
    permission: { type: PermissionType.Anyone },
    field: {
      fieldId: "",
      type: FieldType.Options,
      name: "",
      optionsConfig: {
        options: [],
        hasRequestOptions: false,
        maxSelections: 1,
        previousStepOptions: false,
        selectionType: FieldOptionsSelectionType.Select,
      },
      required: true,
    },
  },
  result: {
    type: ResultType.Decision,
    minimumResponses: 1,
    requestExpirationSeconds: 259200,
    decision: {
      type: DecisionType.NumberThreshold,
      threshold: {
        decisionThresholdCount: 2,
      },
      defaultOptionId: "None",
    },
  },
  action: { type: ActionNewType.None },
};

export const defaultLlmSummaryStepFormValues: StepSchemaType = {
  request: {
    permission: { type: PermissionType.Anyone },
    fields: [],
  },
  response: {
    permission: { type: PermissionType.Anyone },
    field: {
      fieldId: "",
      type: FieldType.FreeInput,
      name: "",
      freeInputDataType: FieldDataType.String,
      required: true,
    },
  },
  result: {
    type: ResultType.LlmSummary,
    minimumResponses: 1,
    requestExpirationSeconds: 259200,
    llmSummary: {
      prompt: "",
      type: LlmSummaryType.AfterEveryResponse,
    },
  },
  action: { type: ActionNewType.None },
};
