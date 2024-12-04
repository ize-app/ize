import { UUIDRemapper } from "@/components/Form/utils/UUIDRemapper";
import { FlowFragment } from "@/graphql/generated/graphql";

import { createFieldsFormState } from "./createFieldsFormState";
import { createPermissionFormState } from "./createPermissionFormState";
import { createStepFormState } from "./createStepFormState";
import { FlowSchemaType } from "../../formValidation/flow";

// takes an existing flow and converts it to form state so that flow can be editted
export const createFlowFormState = (flow: FlowFragment): FlowSchemaType => {
  const { name, fieldSet, trigger, steps } = flow;

  const uuidRemapper = new UUIDRemapper();

  // remapping up front because actions can reference future step ids
  flow.steps.forEach((step) => {
    uuidRemapper.remapId(step.id);
  })

  return {
    flowVersionId: crypto.randomUUID(),
    type: flow.type,
    name,
    fieldSet: {
      ...fieldSet,
      fields: createFieldsFormState(fieldSet.fields, uuidRemapper),
    },
    trigger: {
      ...trigger,
      permission: createPermissionFormState(trigger.permission),
    },
    steps: steps.map((step) => createStepFormState(step, uuidRemapper)),
  };
};
