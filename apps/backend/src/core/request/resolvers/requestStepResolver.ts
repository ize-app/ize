import { actionExecutionResolver } from "@/core/action/actionExecutionResolver";
import { responsesResolver } from "@/core/response/responseResolver";
import { resultResolver } from "@/core/result/resolvers/resultResolver";
import { ResultPrismaType } from "@/core/result/resultPrismaTypes";
import { GraphqlRequestContext } from "@/graphql/context";
import { Field, RequestStep, ResultConfig } from "@/graphql/generated/resolver-types";

import { fieldAnswerResolver } from "../../fields/resolvers/fieldAnswerResolver";
import { fieldSetResolver } from "../../fields/resolvers/fieldSetResolver";
import { StepPrismaType } from "../../flow/flowPrismaTypes";
import { RequestStepPrismaType } from "../requestPrismaTypes";

export const requestStepResolver = async ({
  reqStep,
  step,
  context,
  responseFieldsCache = [],
  resultConfigsCache = [],
  userId,
  // refers to whether request as a whole, rather than just the request step is final
  requestFinal,
}: {
  reqStep: RequestStepPrismaType;
  step: StepPrismaType;
  userId: string | null | undefined;
  responseFieldsCache?: Field[];
  resultConfigsCache?: ResultConfig[];
  context: GraphqlRequestContext;
  requestFinal: boolean;
}): Promise<RequestStep> => {
  const [responseFieldAnswers, userResponses] = await responsesResolver(
    reqStep.Responses,
    context.currentUser?.id,
  );
  const res: RequestStep = {
    requestStepId: reqStep.id,
    createdAt: reqStep.createdAt.toISOString(),
    expirationDate: reqStep.expirationDate.toISOString(),
    requestFieldAnswers: await Promise.all(
      reqStep.RequestFieldAnswers.map(
        async (rfa) =>
          await fieldAnswerResolver({
            fieldAnswer: rfa,
            userIdentityIds: context.currentUser?.Identities.map((id) => id.id),
            userId: userId ?? undefined,
          }),
      ),
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
    responseComplete: reqStep.final,
    resultsComplete: reqStep.final,
    final: reqStep.final,
  };
  return res;
};
