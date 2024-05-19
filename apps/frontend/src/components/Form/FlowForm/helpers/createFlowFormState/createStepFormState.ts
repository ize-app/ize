import { Step } from "@/graphql/generated/graphql";
import { StepSchemaType } from "../../formValidation/flow";
import { createPermissionFormState } from "./createPermissionFormState";
import { createFieldsFormState } from "./createFieldsFormState";
import { createResultFormState } from "./createResultsFormState";
import { createActionFormState } from "./createActionFormState";

export const createStepFormState = (step: Step): StepSchemaType => {
  return {
    request: {
      permission: createPermissionFormState(step.request.permission),
      fields: createFieldsFormState(step.request.fields),
    },
    response: {
      permission: createPermissionFormState(step.response.permission),
      fields: createFieldsFormState(step.response.fields),
    },
    result: createResultFormState(step.result),
    action: createActionFormState(step.action),
    expirationSeconds: step.expirationSeconds ?? undefined,
    allowMultipleResponses: step.allowMultipleResponses,
  };
};
