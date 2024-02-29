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

export const defaultDecisionStepFormValues: StepSchemaType = {
  request: {
    permission: { type: PermissionType.Anyone, entities: [] },
    fields: [],
  },
  response: {
    permission: { type: PermissionType.Anyone, entities: [] },
    field: {
      fieldId: "",
      type: FieldType.Options,
      name: "",
      optionsConfig: {
        options: [],
        hasRequestOptions: false,
        maxSelections: 1,
        previousStepOptions: false,
        requestOptionsDataType: FieldDataType.String,
        selectionType: FieldOptionsSelectionType.Select,
      },
      required: true,
    },
  },
  result: {
    type: ResultType.Decision,
    minimumResponses: 1,
    decision: {
      type: DecisionType.NumberThreshold,
      threshold: 1,
      defaultOptionId: "None",
    },
  },
  action: { type: ActionNewType.None },
  expirationSeconds: 259200,
};

export const defaultLlmSummaryStepFormValues: StepSchemaType = {
  request: {
    permission: { type: PermissionType.Anyone, entities: [] },
    fields: [],
  },
  response: {
    permission: { type: PermissionType.Anyone, entities: [] },
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
