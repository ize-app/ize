import { RequestStep } from "@/graphql/generated/resolver-types";
import { RequestStepPrismaType } from "../requestPrismaTypes";
import { StepPrismaType } from "../../flow/flowPrismaTypes";
import { fieldSetResolver } from "../../fields/resolvers/fieldSetResolver";
import { fieldAnswerResolver } from "../../fields/resolvers/fieldAnswerResolver";
import { responsesResolver } from "@/core/response/responseResolver";

export const requestStepResolver = ({
  reqStep,
  step,
}: {
  reqStep: RequestStepPrismaType;
  step: StepPrismaType;
}): RequestStep => {
  const res: RequestStep = {
    requestStepId: reqStep.id,
    createdAt: reqStep.createdAt.toISOString(),
    expirationDate: reqStep.expirationDate.toISOString(),
    requestFieldAnswers: reqStep.RequestFieldAnswers.map((rfa) =>
      fieldAnswerResolver({ fieldAnswer: rfa }),
    ),
    responseFields: fieldSetResolver({
      fieldSet: step.ResponseFieldSet,
      requestDefinedOptionSets: reqStep.RequestDefinedOptionSets,
    }),
    responses: responsesResolver(reqStep.Responses),
  };
  return res;
};
