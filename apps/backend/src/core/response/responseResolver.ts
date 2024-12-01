import { GraphqlRequestContext } from "@/graphql/context";
import {
  Entity,
  Field,
  OptionSelectionType,
  ResponseFieldAnswers,
  ResponseFieldAnswersOptionsSummary,
  UserFieldAnswer,
  ValueType,
} from "@/graphql/generated/resolver-types";

import { ResponsePrismaType } from "./responsePrismaTypes";
import { entityResolver } from "../entity/entityResolver";
import { FieldAnswerPrismaType } from "../fields/fieldPrismaTypes";
import { calculateAggregateOptionWeights } from "../result/utils/calculateAggregateOptionWeights";
import { getUserEntityIds } from "../user/getUserEntityIds";
import { valueResolver } from "../value/valueResolver";

export const responsesResolver = ({
  responses,
  fields,
  context,
}: {
  responses: ResponsePrismaType[];
  fields: Field[];
  context: GraphqlRequestContext;
}): { answers: ResponseFieldAnswers[]; userResponded: boolean } => {
  const answers: ResponseFieldAnswers[] = fields.map((f) => {
    return {
      field: f,
      answers: [],
      summary: {
        count: 0,
      },
    };
  });

  const fieldAnswerCreators: { [id: string]: Entity } = {};

  let userResponded = true;

  const userEntityIds = getUserEntityIds(context.currentUser);

  const dbFieldAnswers: FieldAnswerPrismaType[] = [];
  responses.forEach((response) => {
    const creator = entityResolver({ entity: response.CreatorEntity });
    if (!userResponded && userEntityIds.includes(creator.id)) userResponded = true;
    response.Answers.forEach((answer) => {
      dbFieldAnswers.push(answer);
      fieldAnswerCreators[answer.id] = creator;
    });
  });

  dbFieldAnswers.map((answer) => {
    const field = fields.find((f) => f.fieldId === answer.fieldId);
    if (!field) {
      throw new Error(`Field with id ${answer.fieldId} not found`);
    }
    const userAnswer: UserFieldAnswer = {
      answer: valueResolver({ type: "default", value: answer.Value, context }),
      creator: fieldAnswerCreators[answer.id],
      createdAt: answer.createdAt.toISOString(),
    };

    const answersArr = answers.find((f) => f.field.fieldId === answer.fieldId)?.answers;

    if (!answersArr) {
      throw new Error(
        `Response ${answer.responseId} has answer for field ${answer.fieldId} but field is not part of request step`,
      );
    }

    answersArr.push(userAnswer);
  });

  answers.map((r) => {
    const answerCount = r.answers.length;
    if (r.field.type === ValueType.OptionSelections && r.field.optionsConfig?.selectionType) {
      const options: ResponseFieldAnswersOptionsSummary[] = [];

      const rawWeights = calculateAggregateOptionWeights({
        type: "userFieldAnswer",
        answers: r.answers,
      });
      if (r.field.optionsConfig?.selectionType === OptionSelectionType.Rank) {
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
    return;
  });

  return { answers, userResponded };
};
