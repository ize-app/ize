import { ActionType } from "@/graphql/generated/graphql";

import { StepSchemaType } from "../formValidation/flow";
import { PermissionType } from "../formValidation/permission";

export const defaultStepFormValues: StepSchemaType = {
  allowMultipleResponses: false,
  request: {
    permission: { type: PermissionType.Anyone, entities: [] },
    fields: [],
    fieldsLocked: false,
  },
  response: {
    permission: { type: PermissionType.Anyone, entities: [] },
    fields: [],
    fieldsLocked: false,
  },
  result: [],
  action: { type: ActionType.None, locked: false },
  expirationSeconds: 259200,
};
