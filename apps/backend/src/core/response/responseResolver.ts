import { GraphqlRequestContext } from "@/graphql/context";
import {
  Field,
  Response,
  ResponseFieldAnswers,
  UserFieldAnswer,
} from "@/graphql/generated/resolver-types";

import { ResponsePrismaType } from "./responsePrismaTypes";
import { entityResolver } from "../entity/entityResolver";
import { fieldAnswerResolver } from "../fields/resolvers/fieldAnswerResolver";

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
    return { field: f, answers: [] };
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

  return [responseFieldAnswers, userResponses];
};
