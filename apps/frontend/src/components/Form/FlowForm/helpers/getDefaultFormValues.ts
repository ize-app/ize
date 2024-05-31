import { ActionType } from "@/graphql/generated/graphql";

import { StepSchemaType } from "../formValidation/flow";
import { PermissionType } from "../formValidation/permission";

export const defaultStepFormValues: StepSchemaType = {
  allowMultipleResponses: false,
  request: {
    permission: { type: PermissionType.Anyone, entities: [] },
    fields: [],
  },
  response: {
    permission: { type: PermissionType.Anyone, entities: [] },
    fields: [],
  },
  result: [],
  action: { type: ActionType.None },
  expirationSeconds: 259200,
};
