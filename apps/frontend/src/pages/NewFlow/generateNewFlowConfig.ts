import { FlowSchemaType } from "@/components/Form/FlowForm/formValidation/flow";
import { PermissionType } from "@/components/Form/FlowForm/formValidation/permission";
import { defaultStepFormValues } from "@/components/Form/FlowForm/helpers/getDefaultFormValues";
import { DecisionType } from "@/graphql/generated/graphql";

export const generateNewFlowConfig = (): FlowSchemaType => {
  return {
    name: "test",
    evolve: {
      requestPermission: { type: PermissionType.Anyone, entities: [] },
      responsePermission: { type: PermissionType.Anyone, entities: [] },
      decision: {
        type: DecisionType.NumberThreshold,
        threshold: 1,
      },
    },
    steps: [defaultStepFormValues],
  };
};
