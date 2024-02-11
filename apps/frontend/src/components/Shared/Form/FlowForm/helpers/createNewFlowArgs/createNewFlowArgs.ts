import { NewFlowFormFields } from "@/components/NewFlow/newFlowWizard";
import { NewFlowArgs } from "@/graphql/generated/graphql";
import { createFieldArgs, createFieldsArgs } from "./createFieldsArgs";

export const createNewFlowArgs = (formState: NewFlowFormFields): NewFlowArgs => {
  const args: NewFlowArgs = {
    steps: formState.steps.map((step) => {
      return {
        request: { fields: createFieldsArgs(step.request?.fields ?? []) },
        response: { fields: [createFieldArgs(step.response.field)] },
      };
    }),
  };
  console.log("created args are ", args);
  return args;
};
