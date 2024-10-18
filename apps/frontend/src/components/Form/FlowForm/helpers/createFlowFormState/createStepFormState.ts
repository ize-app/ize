import { PermissionFragment, Step } from "@/graphql/generated/graphql";

import { createActionFormState } from "./createActionFormState";
import { createFieldsFormState } from "./createFieldsFormState";
import { createPermissionFormState } from "./createPermissionFormState";
import { createResultFormState } from "./createResultsFormState";
import { StepSchemaType } from "../../formValidation/flow";

export const createStepFormState = (step: Step): StepSchemaType => {
  const { fieldSet, response, result, action } = step;
  return {
    response: response
      ? {
          ...response,
          permission: createPermissionFormState(response.permission as PermissionFragment),
        }
      : undefined,
    fieldSet: { ...fieldSet, fields: createFieldsFormState(fieldSet.fields) },
    result: createResultFormState(result),
    action: createActionFormState(action),
  };
};
