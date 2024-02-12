import { NewFlowFormFields } from "@/components/NewFlow/newFlowWizard";
import { NewFlowArgs } from "@/graphql/generated/graphql";
import { createFieldArgs, createFieldsArgs } from "./createFieldsArgs";
import { createPermissionArgs } from "./createPermissionsArgs";

export const createNewFlowArgs = (formState: NewFlowFormFields): NewFlowArgs => {
  const args: NewFlowArgs = {
    steps: formState.steps.map((step) => {
      return {
        request: {
          fields: createFieldsArgs(step.request.fields ?? []),
          permission: createPermissionArgs(step.request.permission),
        },
        response: {
          fields: [createFieldArgs(step.response.field)],
          permission: createPermissionArgs(step.response.permission),
        },
      };
    }),
  };
  console.log("created args are ", args);
  return args;
};
