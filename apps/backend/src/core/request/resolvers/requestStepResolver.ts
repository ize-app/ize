import { actionExecutionResolver } from "@/core/action/actionExecutionResolver";
import { responsesResolver } from "@/core/response/responseResolver";
import { resultGroupResolver } from "@/core/result/resolvers/resultGroupResolver";
import { ResultGroupPrismaType } from "@/core/result/resultPrismaTypes";
import { GraphqlRequestContext } from "@/graphql/context";
import { Field, FieldSet, RequestStep, ResultConfig } from "@/graphql/generated/resolver-types";

import { fieldSetResolver } from "../../fields/resolvers/fieldSetResolver";
import { StepPrismaType } from "../../flow/flowPrismaTypes";
import { RequestStepPrismaType } from "../requestPrismaTypes";

export const requestStepResolver = async ({
  reqStep,
  step,
  context,
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
  context: GraphqlRequestContext;
  requestFinal: boolean;
}): Promise<RequestStep> => {
  const fieldSet: FieldSet = fieldSetResolver({
    fieldSet: step.FieldSet,
    requestDefinedOptionSets: reqStep.RequestDefinedOptionSets,
    responseFieldsCache,
    resultConfigsCache,
  });

  const [responseFieldAnswers, userResponses] = await responsesResolver({
    responses: reqStep.Responses,
    fields: fieldSet.fields,
    context,
  });
  
  const res: RequestStep = {
    requestStepId: reqStep.id,
    createdAt: reqStep.createdAt.toISOString(),
    expirationDate: reqStep.expirationDate.toISOString(),
    fieldSet,
    actionExecution: actionExecutionResolver(reqStep.ActionExecution, step.Action, requestFinal),
    responseFieldAnswers,
    userResponses,
    results: reqStep.ResultGroups.map((result: ResultGroupPrismaType) =>
      resultGroupResolver(result),
    ),
    status: {
      responseFinal: reqStep.responseFinal,
      resultsFinal: reqStep.resultsFinal,
      actionsFinal: reqStep.actionsFinal,
      final: reqStep.final,
    },
  };
  return res;
};
