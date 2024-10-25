import { ActionType, FlowType } from "@/graphql/generated/graphql";

import { FlowSchemaType, StepSchemaType } from "../formValidation/flow";
import { PermissionType } from "../formValidation/permission";

export const defaultStepFormValues: StepSchemaType = {
  fieldSet: {
    fields: [],
    locked: false,
  },
  response: {
    permission: { type: PermissionType.Anyone, entities: [] },
    expirationSeconds: 259200,
    canBeManuallyEnded: true,
    allowMultipleResponses: false,
  },
  result: [],
  action: { type: ActionType.None, locked: false },
};

export const defaultFlowFormValues: FlowSchemaType = {
  name: "",
  type: FlowType.Custom,
  fieldSet: {
    fields: [],
    locked: false,
  },
  trigger: {
    permission: {
      type: PermissionType.Anyone,
      entities: [],
    },
  },
  steps: [defaultStepFormValues],
};
