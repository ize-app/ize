import { FlowSchemaType } from "../../formValidation/flow";
import { DecisionNewArgs, NewFlowArgs } from "@/graphql/generated/graphql";
import { createFieldsArgs } from "./createFieldsArgs";
import { createPermissionArgs } from "./createPermissionsArgs";
import { createActionArgs } from "./createActionArgs";
import { createResultsArgs } from "./createResultArgs";

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
          fields: createFieldsArgs(step.response.fields ?? []),
          permission: createPermissionArgs(step.response.permission),
        },
        result: createResultsArgs(step.results, step.response?.fields),
        action: createActionArgs(step.action, step.response?.fields),
        expirationSeconds: step.expirationSeconds,
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
