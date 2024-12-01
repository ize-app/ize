import {
  ActionType,
  DecisionType,
  FlowType,
  NewFlowArgs,
  OptionSelectionType,
  PermissionArgs,
  ResultType,
  ValueType,
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
      const responseFieldId = crypto.randomUUID();
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
            stepId: crypto.randomUUID(),
            fieldSet: {
              fields: [
                {
                  fieldId: crypto.randomUUID(),
                  type: ValueType.String,
                  name: prompt,
                  isInternal: false,
                  required: true,
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
                resultConfigId: crypto.randomUUID(),
                type: ResultType.LlmSummary,
                fieldId: responseFieldId,
                llmSummary: { prompt: "", isList: false },
              },
            ],
            action: undefined,
          },
        ],
      };
    }
    case FlowConfigGeneration.Ideate: {
      const responseFieldId = crypto.randomUUID();
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
            stepId: crypto.randomUUID(),
            fieldSet: {
              fields: [
                {
                  fieldId: responseFieldId,
                  type: ValueType.String,
                  name: prompt,
                  isInternal: false,
                  required: true,
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
                resultConfigId: crypto.randomUUID(),
                type: ResultType.LlmSummary,
                fieldId: responseFieldId,
                llmSummary: { prompt: "", isList: true },
              },
            ],
            action: undefined,
          },
        ],
      };
    }
    case FlowConfigGeneration.LetAiDecide: {
      const step1ResponseFieldId = crypto.randomUUID();
      const step2ResponseFieldId = crypto.randomUUID();
      const step1ResultId = crypto.randomUUID();
      return {
        flowVersionId: crypto.randomUUID(),
        type: FlowType.Custom,
        name: "Ideate together",

        requestName: prompt,
        trigger: { permission: emptyPermission },
        fieldSet: {
          fields: [
            {
              fieldId: crypto.randomUUID(),
              type: ValueType.String,
              name: prompt,
              isInternal: false,
              required: true,
            },
          ],
          locked: false,
        },
        steps: [
          {
            stepId: crypto.randomUUID(),
            fieldSet: {
              fields: [
                {
                  fieldId: step1ResponseFieldId,
                  type: ValueType.String,
                  name: prompt,
                  isInternal: false,
                  required: true,
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
                resultConfigId: step1ResultId,
                type: ResultType.LlmSummary,
                fieldId: step1ResponseFieldId,
                llmSummary: { prompt: "", isList: true },
              },
            ],
            action: { type: ActionType.TriggerStep, locked: false },
          },
          {
            stepId: crypto.randomUUID(),
            fieldSet: {
              fields: [
                {
                  fieldId: step2ResponseFieldId,
                  type: ValueType.OptionSelections,
                  name: prompt,
                  isInternal: true,
                  required: true,
                  optionsConfig: {
                    options: [],
                    selectionType: OptionSelectionType.Select,
                    linkedResultOptions: [step1ResultId],
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
                resultConfigId: crypto.randomUUID(),
                type: ResultType.Decision,
                fieldId: step2ResponseFieldId,
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
