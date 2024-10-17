import {
  FieldDataType,
  FieldType,
  NewFlowArgs,
  PermissionArgs,
  ResultType,
} from "@/graphql/generated/resolver-types";

export enum FlowConfigGeneration {
  Synthesize = "Synthesize",
  Ideate = "Ideate",
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
  const allowMultipleResponses = true;
  const respondPermission: PermissionArgs = { anyone: false, entities: [{ id: respondEntityId }] };
  const triggerPermission: PermissionArgs = { anyone: false, entities: [] };

  switch (type) {
    case FlowConfigGeneration.Synthesize: {
      return {
        name: "Synthesize group perspectives",
        reusable,
        requestName: prompt,
        steps: [
          {
            request: { permission: triggerPermission, fields: [] },
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
            allowMultipleResponses,
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
            request: { permission: triggerPermission, fields: [] },
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
            allowMultipleResponses,
            canBeManuallyEnded,
          },
        ],
        evolve: undefined,
      };
    }
  }
};
