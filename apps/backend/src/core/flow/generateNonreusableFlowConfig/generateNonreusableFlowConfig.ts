import {
  ActionType,
  DecisionType,
  FieldDataType,
  FieldOptionsSelectionType,
  FieldType,
  NewFlowArgs,
  PermissionArgs,
  ResultType,
} from "@/graphql/generated/resolver-types";

export enum FlowConfigGeneration {
  Synthesize = "Synthesize",
  Ideate = "Ideate",
  LetAiDecide = "LetAiDecide",
}

interface GenerateCustomFlowConfig {
  respondEntityId: string;
  type: FlowConfigGeneration;
  prompt: string;
}

export const generateNonreusableFlowConfig = ({
  respondEntityId,
  type,
  prompt,
}: GenerateCustomFlowConfig): NewFlowArgs => {
  const reusable = false;
  const expirationSeconds = 60 * 60 * 24 * 3;
  const canBeManuallyEnded = true;
  const respondPermission: PermissionArgs = { anyone: false, entities: [{ id: respondEntityId }] };
  const emptyPermission: PermissionArgs = { anyone: false, entities: [] };

  switch (type) {
    case FlowConfigGeneration.Synthesize: {
      return {
        name: "Synthesize group perspectives",
        reusable,
        requestName: prompt,
        steps: [
          {
            request: { permission: emptyPermission, fields: [] },
            response: {
              permission: respondPermission,
              fields: [
                {
                  fieldId: "",
                  type: FieldType.FreeInput,
                  name: prompt,
                  isInternal: false,
                  required: true,
                  freeInputDataType: FieldDataType.String,
                },
              ],
            },
            result: [
              {
                type: ResultType.LlmSummary,
                responseFieldIndex: 0,
                minimumAnswers: 2,
                llmSummary: { prompt: "", example: "" },
              },
            ],
            action: undefined,
            expirationSeconds,
            allowMultipleResponses: true,
            canBeManuallyEnded,
          },
        ],
        evolve: undefined,
      };
    }
    case FlowConfigGeneration.Ideate: {
      return {
        name: "Ideate together",
        reusable,
        requestName: prompt,
        steps: [
          {
            request: { permission: emptyPermission, fields: [] },
            response: {
              permission: respondPermission,
              fields: [
                {
                  fieldId: "",
                  type: FieldType.FreeInput,
                  name: prompt,
                  isInternal: false,
                  required: true,
                  freeInputDataType: FieldDataType.String,
                },
              ],
            },
            result: [
              {
                type: ResultType.LlmSummaryList,
                responseFieldIndex: 0,
                minimumAnswers: 2,
                llmSummary: { prompt: "", example: "" },
              },
            ],
            action: undefined,
            expirationSeconds,
            allowMultipleResponses: true,
            canBeManuallyEnded,
          },
        ],
        evolve: undefined,
      };
    }
    case FlowConfigGeneration.LetAiDecide: {
      return {
        name: "Ideate together",
        reusable,
        requestName: prompt,
        steps: [
          {
            request: { permission: emptyPermission, fields: [] },
            response: {
              permission: respondPermission,
              fields: [
                {
                  fieldId: "",
                  type: FieldType.FreeInput,
                  name: prompt,
                  isInternal: false,
                  required: true,
                  freeInputDataType: FieldDataType.String,
                },
              ],
            },
            result: [
              {
                type: ResultType.LlmSummaryList,
                responseFieldIndex: 0,
                minimumAnswers: 2,
                llmSummary: { prompt: "", example: "" },
              },
            ],
            action: { type: ActionType.TriggerStep, locked: false },
            expirationSeconds,
            allowMultipleResponses: true,
            canBeManuallyEnded,
          },
          {
            request: { permission: emptyPermission, fields: [] },
            response: {
              permission: emptyPermission,
              fields: [
                {
                  fieldId: "",
                  type: FieldType.Options,
                  name: prompt,
                  isInternal: true,
                  required: true,
                  freeInputDataType: FieldDataType.String,
                  optionsConfig: {
                    options: [],
                    previousStepOptions: true,
                    selectionType: FieldOptionsSelectionType.Select,
                    linkedResultOptions: [{ stepIndex: 0, resultIndex: 0 }],
                  },
                },
              ],
            },
            result: [
              {
                type: ResultType.Decision,
                responseFieldIndex: 0,
                minimumAnswers: 0,

                decision: { type: DecisionType.Ai },
              },
            ],
            action: undefined,
            expirationSeconds,
            allowMultipleResponses: false,
            canBeManuallyEnded,
          },
        ],
        evolve: undefined,
      };
    }
  }
};
