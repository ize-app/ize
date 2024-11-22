import {
  ActionType,
  DecisionType,
  FieldDataType,
  FieldOptionsSelectionType,
  FieldType,
  FlowType,
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
  const expirationSeconds = 60 * 60 * 24 * 3;
  const canBeManuallyEnded = true;
  const respondPermission: PermissionArgs = { anyone: false, entities: [{ id: respondEntityId }] };
  const emptyPermission: PermissionArgs = { anyone: false, entities: [] };

  switch (type) {
    case FlowConfigGeneration.Synthesize: {
      return {
        flowVersionId: crypto.randomUUID(),
        type: FlowType.Custom,
        name: "Synthesize group perspectives",

        requestName: prompt,
        trigger: {
          permission: emptyPermission,
        },
        fieldSet: {
          locked: false,
          fields: [],
        },
        steps: [
          {
            fieldSet: {
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
              locked: false,
            },
            response: {
              permission: respondPermission,
              expirationSeconds,
              allowMultipleResponses: true,
              canBeManuallyEnded,
              minResponses: 1,
            },
            result: [
              {
                type: ResultType.LlmSummary,
                responseFieldIndex: 0,
                llmSummary: { prompt: "", isList: false },
              },
            ],
            action: undefined,
          },
        ],
      };
    }
    case FlowConfigGeneration.Ideate: {
      return {
        flowVersionId: crypto.randomUUID(),
        type: FlowType.Custom,
        name: "Ideate together",

        requestName: prompt,
        fieldSet: {
          locked: false,
          fields: [],
        },
        trigger: {
          permission: emptyPermission,
        },
        steps: [
          {
            fieldSet: {
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
              locked: false,
            },
            response: {
              permission: respondPermission,
              expirationSeconds,
              allowMultipleResponses: true,
              canBeManuallyEnded,
              minResponses: 1,
            },
            result: [
              {
                type: ResultType.LlmSummary,
                responseFieldIndex: 0,
                llmSummary: { prompt: "", isList: true },
              },
            ],
            action: undefined,
          },
        ],
      };
    }
    case FlowConfigGeneration.LetAiDecide: {
      return {
        flowVersionId: crypto.randomUUID(),
        type: FlowType.Custom,
        name: "Ideate together",

        requestName: prompt,
        trigger: { permission: emptyPermission },
        fieldSet: {
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
          locked: false,
        },
        steps: [
          {
            fieldSet: {
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
              locked: false,
            },
            response: {
              permission: respondPermission,
              expirationSeconds,
              allowMultipleResponses: true,
              canBeManuallyEnded,
              minResponses: 1,
            },
            result: [
              {
                type: ResultType.LlmSummary,
                responseFieldIndex: 0,
                llmSummary: { prompt: "", isList: true },
              },
            ],
            action: { type: ActionType.TriggerStep, locked: false },
          },
          {
            fieldSet: {
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
              locked: false,
            },
            response: {
              permission: emptyPermission,
              expirationSeconds,
              allowMultipleResponses: false,
              canBeManuallyEnded,
              minResponses: 1,
            },
            result: [
              {
                type: ResultType.Decision,
                responseFieldIndex: 0,

                decision: { type: DecisionType.Ai },
              },
            ],
            action: undefined,
          },
        ],
      };
    }
  }
};
