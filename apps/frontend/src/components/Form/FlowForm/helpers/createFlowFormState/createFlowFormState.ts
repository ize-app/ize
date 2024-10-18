import { FlowFragment, Step } from "@/graphql/generated/graphql";

import { createEvolveFormState } from "./createEvolveFormState";
import { createFieldsFormState } from "./createFieldsFormState";
import { createPermissionFormState } from "./createPermissionFormState";
import { createStepFormState } from "./createStepFormState";
import { FlowSchemaType } from "../../formValidation/flow";

// takes an existing flow and converts it to form state so that flow can be editted
export const createFlowFormState = (flow: FlowFragment): FlowSchemaType => {
  const { name, reusable, fieldSet, trigger, steps, evolve } = flow;
  return {
    name,
    reusable,
    fieldSet: {
      ...fieldSet,
      fields: createFieldsFormState(fieldSet.fields),
    },
    trigger: {
      ...trigger,
      permission: createPermissionFormState(trigger.permission),
    },
    steps: steps.map((step) => createStepFormState(step as Step)),
    evolve: createEvolveFormState(evolve as FlowFragment),
  };
};
