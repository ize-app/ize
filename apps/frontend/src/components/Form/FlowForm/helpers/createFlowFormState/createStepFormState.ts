import { PermissionFragment, Step } from "@/graphql/generated/graphql";

import { createActionFormState } from "./createActionFormState";
import { createFieldsFormState } from "./createFieldsFormState";
import { createPermissionFormState } from "./createPermissionFormState";
import { createResultFormState } from "./createResultsFormState";
import { StepSchemaType } from "../../formValidation/flow";

export const createStepFormState = (step: Step): StepSchemaType => {
  return {
    request:
      !step.request.permission && step.request.fields.length === 0
        ? undefined
        : {
            permission: createPermissionFormState(step.request.permission as PermissionFragment),
            fields: createFieldsFormState(step.request.fields),
            fieldsLocked: step.request.fieldsLocked,
          },
    response:
      !step.response.permission && step.response.fields.length === 0
        ? undefined
        : {
            permission: createPermissionFormState(step.response.permission as PermissionFragment),
            fields: createFieldsFormState(step.response.fields),
            fieldsLocked: step.response.fieldsLocked,
          },
    result: createResultFormState(step.result),
    action: createActionFormState(step.action),
    expirationSeconds: step.expirationSeconds ?? undefined,
    allowMultipleResponses: step.allowMultipleResponses,
    canBeManuallyEnded: step.canBeManuallyEnded,
  };
};
