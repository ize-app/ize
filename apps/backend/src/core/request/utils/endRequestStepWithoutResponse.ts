import { StepPrismaType } from "@/core/flow/flowPrismaTypes";

export const canEndRequestStepWithResponse = ({ step }: { step: StepPrismaType }) => {
  return (
    !step.ResponseFieldSet || step.ResponseFieldSet.FieldSetFields.every((f) => f.Field.isInternal)
  );
};
