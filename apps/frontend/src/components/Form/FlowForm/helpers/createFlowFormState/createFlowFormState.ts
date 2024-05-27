import { FlowFragment, Step } from "@/graphql/generated/graphql";

import { createEvolveFormState } from "./createEvolveFormState";
import { createStepFormState } from "./createStepFormState";
import { FlowSchemaType } from "../../formValidation/flow";

// takes an existing flow and converts it to form state so that flow can be editted
export const createFlowFormState = (flow: FlowFragment): FlowSchemaType => {
  return {
    name: flow.name,
    steps: flow.steps.map((step) => createStepFormState(step as Step)),
    evolve: createEvolveFormState(flow.evolve as FlowFragment),
  };
};
