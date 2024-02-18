import { FlowSchemaType } from "../../formValidation/flow";
import { DecisionNewArgs, FieldType, NewFlowArgs } from "@/graphql/generated/graphql";
import { createFieldArgs, createFieldsArgs } from "./createFieldsArgs";
import { createPermissionArgs } from "./createPermissionsArgs";
import { createActionArgs } from "./createActionArgs";
import { createResultArgs } from "./createResultArgs";

export const createNewFlowArgs = (formState: FlowSchemaType): NewFlowArgs => {
  const args: NewFlowArgs = {
    name: formState.name,
    reusable: formState.reusable,
    steps: formState.steps.map((step) => {
      return {
        ...step,
        request: step.request && {
          fields: createFieldsArgs(step.request.fields ?? []),
          permission: createPermissionArgs(step.request.permission),
        },
        response: step.response && {
          fields: [createFieldArgs(step.response.field)],
          permission: createPermissionArgs(step.response.permission),
        },
        action: createActionArgs(step.action, step.response?.field),
        result: createResultArgs(step.result, step.response?.field),
      };
    }),
    evolve: formState.evolve && {
      ...formState.evolve,
      decision: formState.evolve.decision as DecisionNewArgs,
      requestPermission: createPermissionArgs(formState.evolve.requestPermission),
      responsePermission: createPermissionArgs(formState.evolve.responsePermission),
    },
  };
  console.log("created args are ", args);
  return args;
};
