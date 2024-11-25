import { UUIDRemapper } from "@/components/Form/utils/UUIDRemapper";
import { PermissionFragment, StepFragment } from "@/graphql/generated/graphql";

import { createActionFormState } from "./createActionFormState";
import { createFieldsFormState } from "./createFieldsFormState";
import { createPermissionFormState } from "./createPermissionFormState";
import { createResultFormState } from "./createResultsFormState";
import { StepSchemaType } from "../../formValidation/flow";

export const createStepFormState = (
  step: StepFragment,
  uuidRemapper: UUIDRemapper,
): StepSchemaType => {
  const { fieldSet, response, result, action } = step;
  return {
    // stepId already remapped in the parent function
    stepId: uuidRemapper.getRemappedUUID(step.id),
    response: response
      ? {
          ...response,
          permission: createPermissionFormState(response.permission as PermissionFragment),
        }
      : undefined,
    fieldSet: { ...fieldSet, fields: createFieldsFormState(fieldSet.fields, uuidRemapper) },
    result: createResultFormState(result, uuidRemapper),
    action: createActionFormState(action, uuidRemapper),
  };
};
