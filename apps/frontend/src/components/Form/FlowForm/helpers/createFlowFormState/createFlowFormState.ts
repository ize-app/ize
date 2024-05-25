import { FlowFragment, Step } from "@/graphql/generated/graphql";
import { FlowSchemaType } from "../../formValidation/flow";
import { createStepFormState } from "./createStepFormState";
import { createEvolveFormState } from "./createEvolveFormState";

// takes an existing flow and converts it to form state so that flow can be editted
export const createFlowFormState = (flow: FlowFragment): FlowSchemaType => {
  return {
    name: flow.name,
  steps: flow.steps.map((step) => createStepFormState(step as Step)),
    evolve: createEvolveFormState(flow.evolve as FlowFragment),
  };
};
