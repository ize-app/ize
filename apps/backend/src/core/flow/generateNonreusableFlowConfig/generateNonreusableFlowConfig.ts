import {
  FieldDataType,
  FieldType,
  NewFlowArgs,
  ResultType,
} from "@/graphql/generated/resolver-types";

export enum FlowConfigGeneration {
  Synthesize = "Synthesize",
}

interface SynthesizeFlowConfigGenerate {
  type: FlowConfigGeneration.Synthesize;
  prompt: string;
}

type FlowConfigArgs = SynthesizeFlowConfigGenerate;

interface GenerateCustomFlowConfig {
  respondEntityId: string;
  configArgs: FlowConfigArgs;
}

export const generateNonreusableFlowConfig = ({
  respondEntityId,
  configArgs,
}: GenerateCustomFlowConfig): NewFlowArgs => {
  switch (configArgs.type) {
    case FlowConfigGeneration.Synthesize: {
      const { prompt } = configArgs;
      return {
        name: "Synthesize group perspectives",
        reusable: false,
        steps: [
          {
            request: { permission: { anyone: false, entities: [] }, fields: [] },
            response: {
              permission: { anyone: false, entities: [{ id: respondEntityId }] },
              fields: [
                {
                  fieldId: "",
                  type: FieldType.FreeInput,
                  name: prompt,
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
            expirationSeconds: 60 * 60 * 24 * 3,
            allowMultipleResponses: false,
            canBeManuallyEnded: true,
          },
        ],
        evolve: undefined,
      };
    }
  }
};
