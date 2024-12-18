import { Prisma } from "@prisma/client";

import { requestInclude } from "@/core/request/requestPrismaTypes";
import { requestResolver } from "@/core/request/resolvers/requestResolver";
import { Entity, FlowReference, ResultType } from "@/graphql/generated/resolver-types";
import { prisma } from "@/prisma/client";

import { createWebhookValue } from "./createWebhookValue";
import { createRequestUrl } from "../../request/createRequestUrl";

export interface WebhookPayload {
  requestName: string;
  flowName: string;
  context: WebhookTriggerField[];
  results: WebhookResult[];
  requestUrl: string;
}

export interface WebhookTriggerField {
  field: string;
  value: WebhookValue;
}

export interface WebhookResult {
  field: string;
  type: ResultType;
  createdAt: string;
  value: WebhookValue[];
}

export type WebhookValue =
  | string
  | number
  | { uri: string; name: string }
  | string[]
  | Entity[]
  | WebhookValue[]
  | FlowReference[]
  | FlowReference;

// Purpose of this function is to simplify output of request data so it can be output to other tools and stringified
export async function createWebhookPayload({
  requestStepId,
  transaction = prisma,
}: {
  requestStepId: string;
  transaction?: Prisma.TransactionClient;
}): Promise<WebhookPayload> {
  const reqStep = await transaction.requestStep.findUniqueOrThrow({
    include: {
      Request: {
        include: requestInclude,
      },
    },
    where: {
      id: requestStepId,
    },
  });

  const request = await requestResolver({
    req: reqStep.Request,
    context: { currentUser: null, discordApi: undefined, userEntityIds: [] },
    userGroupIds: [],
  });

  const context: WebhookTriggerField[] = [];
  request.triggerFieldAnswers.forEach((tfa) => {
    context.push({ field: tfa.field.name, value: createWebhookValue({ value: tfa.answer }) });
  });

  const results: WebhookResult[] = [];
  request.requestSteps.forEach((rs) => {
    rs.results.forEach((r) => {
      const step = request.flow.steps.find((s) => s.id === rs.stepId);
      const fieldId =
        (step?.result ?? []).find(
          (resultConfig) => resultConfig.resultConfigId === r.resultConfigId,
        )?.field.fieldId ?? "";

      const field = rs.fieldSet.fields.find((f) => f.fieldId === fieldId)?.name ?? "";
      // only outputing first result of result group for now
      // so that output is more predictable / simple
      const result = r.results[0];
      const type = result?.type;
      const value = (result?.resultItems ?? []).map((i) => createWebhookValue({ value: i.value }));
      results.push({ field, type, createdAt: r.createdAt, value });
    });
    // results.push(...rs.results);
  });

  return {
    requestName: request.name,
    flowName: request.flow.name,
    context,
    results,
    requestUrl: createRequestUrl({ requestId: request.requestId }),
  };
}
