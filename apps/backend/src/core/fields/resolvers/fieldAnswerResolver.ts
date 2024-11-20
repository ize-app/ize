import { entityInclude } from "@/core/entity/entityPrismaTypes";
import { entityResolver } from "@/core/entity/entityResolver";
import { createFlowSummaryInclude } from "@/core/flow/flowPrismaTypes";
import { flowSummaryResolver } from "@/core/flow/resolvers/flowSummaryResolver";
import { getUserEntityIds } from "@/core/user/getUserEntityIds";
import { GraphqlRequestContext } from "@/graphql/context";
import {
  EntitiesFieldAnswer,
  FieldAnswer,
  FieldDataType,
  FieldType,
  FreeInputFieldAnswer,
  OptionFieldAnswer,
  OptionFieldAnswerSelection,
} from "@/graphql/generated/resolver-types";
import { ApolloServerErrorCode, GraphQLError } from "@graphql/errors";

import { prisma } from "../../../prisma/client";
import { FieldAnswerPrismaType } from "../fieldPrismaTypes";

export const fieldAnswerResolver = async ({
  fieldAnswer,
  context,
}: {
  fieldAnswer: FieldAnswerPrismaType;
  context: GraphqlRequestContext;
}): Promise<FieldAnswer> => {
  const userIdentityIds = context.currentUser?.Identities.map((id) => id.id);
  switch (fieldAnswer.type) {
    case FieldType.FreeInput: {
      if (fieldAnswer.AnswerFreeInput[0].dataType === FieldDataType.EntityIds) {
        const entityIds = JSON.parse(fieldAnswer.AnswerFreeInput[0].value) as string[];
        const entities = await prisma.entity.findMany({
          include: entityInclude,
          where: { id: { in: entityIds } },
        });

        const entityAnswer: EntitiesFieldAnswer = {
          __typename: "EntitiesFieldAnswer",
          entities: entities.map((entity) => entityResolver({ entity, userIdentityIds })),
        };
        return entityAnswer;
      } else if (fieldAnswer.AnswerFreeInput[0].dataType === FieldDataType.FlowIds) {
        const userEntityIds = getUserEntityIds(context.currentUser);
        const flowIds = JSON.parse(fieldAnswer.AnswerFreeInput[0].value) as string[];
        const flows = await prisma.flow.findMany({
          include: createFlowSummaryInclude(userEntityIds),
          where: { id: { in: flowIds } },
        });
        return {
          __typename: "FlowsFieldAnswer",
          // TODO remove inefficient query
          flows: flows
            .map((flow) =>
              flowSummaryResolver({
                flow,
                context,
                groupIds: [], // TODO pass this in properly
              }),
            )
            .map((f) => ({ flowId: f.flowId, flowName: f.name })),
        };
      } else if (fieldAnswer.AnswerFreeInput[0].dataType === FieldDataType.Webhook) {
        if (fieldAnswer.AnswerFreeInput[0].value === "None") {
          return {
            __typename: "WebhookFieldAnswer",
            uri: "",
          };
        }
        const webhook = await prisma.webhook.findFirst({
          where: { id: fieldAnswer.AnswerFreeInput[0].value },
        });
        return {
          __typename: "WebhookFieldAnswer",
          uri: webhook?.uriPreview ?? "",
        };
      } else {
        const freeInputAnswer: FreeInputFieldAnswer = {
          __typename: "FreeInputFieldAnswer",
          value: fieldAnswer.AnswerFreeInput[0].value,
        };
        return freeInputAnswer;
      }
    }
    case FieldType.Options: {
      const optionsAnswer: OptionFieldAnswer = {
        __typename: "OptionFieldAnswer",
        selections: fieldAnswer.AnswerOptionSelections.map(
          (s): OptionFieldAnswerSelection => ({
            optionId: s.fieldOptionId,
            weight: s.weight,
          }),
        ),
      };
      return optionsAnswer;
    }
    default:
      throw new GraphQLError("Unknown field type", {
        extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
      });
  }
};
