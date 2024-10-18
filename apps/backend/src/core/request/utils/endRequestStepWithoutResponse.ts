import { StepPrismaType } from "@/core/flow/flowPrismaTypes";

export const canEndRequestStepWithResponse = ({ step }: { step: StepPrismaType }) => {
  return !step.ResponseConfig;
};
