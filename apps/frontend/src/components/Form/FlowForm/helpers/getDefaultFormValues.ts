import { FlowType } from "@/graphql/generated/graphql";

import { FlowSchemaType, StepSchemaType } from "../formValidation/flow";

export const getDefaultStepFormValues = (): StepSchemaType => ({
  stepId: crypto.randomUUID(),
  fieldSet: {
    fields: [],
    locked: false,
  },
  response: {
    permission: { anyone: true, entities: [] },
    expirationSeconds: 259200,
    canBeManuallyEnded: true,
    allowMultipleResponses: false,
    minResponses: 1,
  },
  result: [],
  action: undefined,
});

export const getDefaultFlowFormValues = (): FlowSchemaType => ({
  flowVersionId: crypto.randomUUID(),
  name: "",
  type: FlowType.Custom,
  fieldSet: {
    fields: [],
    locked: false,
  },
  trigger: {
    permission: {
      anyone: true,
      entities: [],
    },
  },
  steps: [getDefaultStepFormValues()],
});
