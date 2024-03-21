import { StepPrismaType } from "@/flow/flow/flowPrismaTypes";
import { ResponsePrismaType } from "@/flow/response/type";
import { ResultPrismaType } from "../types";

export const newLlmSummaryResult = ({
  step,
  responses,
}: {
  step: StepPrismaType;
  responses: ResponsePrismaType[];
}): Promise<ResultPrismaType> => {};
