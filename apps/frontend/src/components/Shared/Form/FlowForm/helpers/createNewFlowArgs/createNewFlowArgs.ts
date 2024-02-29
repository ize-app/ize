import { FlowSchemaType } from "../../formValidation/flow";
import { DecisionNewArgs, NewFlowArgs } from "@/graphql/generated/graphql";
import { createFieldArgs, createFieldsArgs } from "./createFieldsArgs";
import { createPermissionArgs } from "./createPermissionsArgs";
import { createActionArgs } from "./createActionArgs";
import { createResultArgs } from "./createResultArgs";

export const createNewFlowArgs = (formState: FlowSchemaType, userId: string): NewFlowArgs => {
  const args: NewFlowArgs = {
    name: formState.name,
    reusable: formState.reusable,
    steps: formState.steps.map((step, index) => {
      return {
        ...step,
        request: {
          fields: createFieldsArgs(step.request?.fields ?? []),
          permission: createPermissionArgs(
            step.request?.permission,
            formState.reusable && index === 0 ? userId : undefined,
          ),
        },
        response: step.response && {
          fields: [createFieldArgs(step.response.field)],
          permission: createPermissionArgs(step.response.permission),
        },
        action: createActionArgs(step.action, step.response?.field),
        result: createResultArgs(step.result, step.response?.field),
        expirationSeconds: step.expirationSeconds
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
