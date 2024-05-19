import { Field, RequestStep, ResultConfig } from "@/graphql/generated/resolver-types";
import { RequestStepPrismaType } from "../requestPrismaTypes";
import { StepPrismaType } from "../../flow/flowPrismaTypes";
import { fieldSetResolver } from "../../fields/resolvers/fieldSetResolver";
import { fieldAnswerResolver } from "../../fields/resolvers/fieldAnswerResolver";
import { responsesResolver } from "@/core/response/responseResolver";
import { ResultPrismaType } from "@/core/result/resultPrismaTypes";
import { resultResolver } from "@/core/result/resolvers/resultResolver";
import { actionExecutionResolver } from "@/core/action/actionExecutionResolver";

export const requestStepResolver = ({
  reqStep,
  step,
  userId,
  responseFieldsCache = [],
  resultConfigsCache = [],
  // refers to whether request as a whole, rather than just the request step is final
  requestFinal,
}: {
  reqStep: RequestStepPrismaType;
  step: StepPrismaType;
  userId: string | null | undefined;
  responseFieldsCache?: Field[];
  resultConfigsCache?: ResultConfig[];
  requestFinal: boolean;
}): RequestStep => {
  const [responseFieldAnswers, userResponses] = responsesResolver(reqStep.Responses, userId);
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
      responseFieldsCache,
      resultConfigsCache,
    }),
    actionExecution: actionExecutionResolver(reqStep.ActionExecution, step.Action, requestFinal),
    responseFieldAnswers,
    userResponses,
    results: reqStep.Results.map((result: ResultPrismaType) => resultResolver(result)),
    responseComplete: reqStep.responseComplete,
    resultsComplete: reqStep.resultsComplete,
    final: reqStep.final,
  };
  return res;
};
