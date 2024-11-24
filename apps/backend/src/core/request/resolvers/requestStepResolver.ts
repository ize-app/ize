import { actionResolver } from "@/core/action/actionExecutionResolver";
import { responsesResolver } from "@/core/response/responseResolver";
import { resultGroupResolver } from "@/core/result/resolvers/resultGroupResolver";
import { ResultGroupPrismaType } from "@/core/result/resultPrismaTypes";
import { GraphqlRequestContext } from "@/graphql/context";
import {
  ActionStatus,
  Field,
  FieldSet,
  RequestStep,
  ResultConfig,
  ResultGroupStatus,
} from "@/graphql/generated/resolver-types";

import { requestStepStatusResolver } from "./requestStepStatusResolver";
import { fieldSetResolver } from "../../fields/resolvers/fieldSetResolver";
import { StepPrismaType } from "../../flow/flowPrismaTypes";
import { RequestDefinedOptionSetPrismaType, RequestStepPrismaType } from "../requestPrismaTypes";

export const requestStepResolver = async ({
  reqStep,
  step,
  context,
  responseFieldsCache = [],
  resultConfigsCache = [],
  requestDefinedOptionSets,
  // refers to whether request as a whole, rather than just the request step is final
}: {
  reqStep: RequestStepPrismaType;
  step: StepPrismaType;
  userId: string | null | undefined;
  responseFieldsCache?: Field[];
  resultConfigsCache?: ResultConfig[];
  requestDefinedOptionSets: RequestDefinedOptionSetPrismaType[];
  context: GraphqlRequestContext;
}): Promise<RequestStep> => {
  const fieldSet: FieldSet = fieldSetResolver({
    fieldSet: step.ResponseFieldSet,
    requestDefinedOptionSets,
    responseFieldsCache,
    resultConfigsCache,
  });

  const [responseFieldAnswers, userResponses] = await responsesResolver({
    responses: reqStep.Responses,
    fields: fieldSet.fields,
    context,
  });

  const actionExecution = actionResolver({
    action: reqStep.Actions,
    actionConfig: step.ActionConfigSet?.ActionConfigs[0],
    actionsFinal: reqStep.actionsFinal,
    resultsFinal: reqStep.resultsFinal,
  });

  const results = reqStep.ResultGroups.map((resultGroup: ResultGroupPrismaType) =>
    resultGroupResolver({
      resultGroup,
      responseFinal: reqStep.responseFinal,
      resultsFinal: reqStep.resultsFinal,
    }),
  );

  const hasActionError = actionExecution?.status === ActionStatus.Error;
  const hasResultsError = results.some((result) => result.status === ResultGroupStatus.Error);

  const status = requestStepStatusResolver({
    requestStep: reqStep,
    hasActionError,
    hasResultsError,
  });

  const res: RequestStep = {
    requestStepId: reqStep.id,
    createdAt: reqStep.createdAt.toISOString(),
    expirationDate: reqStep.expirationDate.toISOString(),
    fieldSet,
    actionExecution,
    responseFieldAnswers,
    userResponses,
    results,
    status,
  };
  return res;
};
