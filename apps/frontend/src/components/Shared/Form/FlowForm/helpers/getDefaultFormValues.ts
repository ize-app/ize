import { StepSchemaType } from "../formValidation/flow";

import { PermissionType } from "../formValidation/permission";
import { ActionNewType } from "@/graphql/generated/graphql";

export const defaultStepFormValues: StepSchemaType = {
  request: {
    permission: { type: PermissionType.Anyone, entities: [] },
    fields: [],
  },
  response: {
    permission: { type: PermissionType.Anyone, entities: [] },
    fields: [],
  },
  results: [],
  action: { type: ActionNewType.None },
  expirationSeconds: 259200,
};
