import { StepSchemaType } from "../formValidation/flow";

import { PermissionType } from "../formValidation/permission";
import { ActionNewType } from "@/graphql/generated/graphql";

export const defaultStepFormValues: StepSchemaType = {
  request: {
    permission: { type: PermissionType.Anyone },
    fields: [],
  },
  response: {
    permission: { type: PermissionType.Anyone },
    fields: [],
  },
  result: [],
  action: { type: ActionNewType.None },
  expirationSeconds: 259200,
};
