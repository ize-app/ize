import { FieldType } from "@prisma/client";

import { GraphqlRequestContext } from "@/graphql/context";
import {
  Field,
  OptionSelectionType,
  Response,
  ResponseFieldAnswers,
  ResponseFieldAnswersOptionsSummary,
  UserFieldAnswer,
} from "@/graphql/generated/resolver-types";

import { ResponsePrismaType } from "./responsePrismaTypes";
import { entityResolver } from "../entity/entityResolver";
import { fieldAnswerResolver } from "../fields/resolvers/fieldAnswerResolver";
import { calculateAggregateOptionWeights } from "../result/utils/calculateAggregateOptionWeights";

export const responsesResolver = async ({
  responses,
  fields,
  context,
}: {
  responses: ResponsePrismaType[];
  fields: Field[];
  context: GraphqlRequestContext;
}): Promise<[ResponseFieldAnswers[], Response[]]> => {
  const responseFieldAnswers: ResponseFieldAnswers[] = fields.map((f) => {
    return {
      field: f,
      answers: [],
      summary: {
        count: 0,
      },
    };
  });

  const userResponses: Response[] = [];

  await Promise.all(
    // go thorugh each response
    responses.map(async (response) => {
      const { createdAt, CreatorEntity, Answers } = response;
      const creator = entityResolver({ entity: CreatorEntity });
      const userId = context.currentUser?.id;
      if (userId) {
        if (userId === CreatorEntity.User?.id || userId === CreatorEntity.Identity?.userId) {
          userResponses.push({
            responseId: response.id,
            createdAt: response.createdAt.toISOString(),
            creator,
            answers: await Promise.all(
              response.Answers.map(
                async (a) => await fieldAnswerResolver({ fieldAnswer: a, context }),
              ),
            ),
          });
        }
      }

      await Promise.all(
        Answers.map(async (a) => {
          const { fieldId } = a;
          const answer = await fieldAnswerResolver({ fieldAnswer: a, context });
          const userAnswer: UserFieldAnswer = {
            answer,
            creator,
            createdAt: createdAt.toISOString(),
          };

          const answersArr = responseFieldAnswers.find((f) => f.field.fieldId === fieldId)?.answers;

          if (!answersArr)
            throw new Error(
              `Response ${response.id} has answer for field ${fieldId} but field is not part of request step`,
            );

          answersArr.push(userAnswer);
        }),
      );
    }),
  );

  responseFieldAnswers.forEach((r) => {
    const answerCount = r.answers.length;
    if (r.field.__typename === FieldType.Options && r.field.selectionType) {
      const options: ResponseFieldAnswersOptionsSummary[] = [];

      const rawWeights = calculateAggregateOptionWeights({
        type: "userFieldAnswer",
        answers: r.answers,
      });
      if (r.field.selectionType === OptionSelectionType.Rank) {
        const optionCount = Object.entries(rawWeights).length;
        Object.entries(rawWeights).map(([optionId, weight]) => {
          const avgWeight = weight / answerCount;
          // weight corresponds to higher ranked, so converting this rank with 1 meaning the best
          const rank = optionCount - avgWeight + 1;
          options.push({ optionId, count: weight, rank: parseFloat(rank.toFixed(2)) });
        });
      } else {
        Object.entries(rawWeights).map(([optionId, weight]) => {
          options.push({ optionId, count: weight });
        });
      }
      r.summary.options = options;
    }
    r.summary.count = answerCount;
  });

  return [responseFieldAnswers, userResponses];
};
