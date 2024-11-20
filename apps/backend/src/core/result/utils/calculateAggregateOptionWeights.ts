import { FieldAnswerPrismaType } from "@/core/fields/fieldPrismaTypes";
import { UserFieldAnswer } from "@/graphql/generated/resolver-types";

// generic function for determining relative priority between options
// for a single select or multiselect, all weights will be 1, so this is effectively an option count
// for a ranking, there are higher weights for higher ranked options

interface CalculateUserFieldAnswerWeightsProps {
  type: "userFieldAnswer";
  answers: UserFieldAnswer[];
}

interface CalculateFieldAnswerWeightsProps {
  type: "fieldAnswer";
  answers: FieldAnswerPrismaType[];
}

type CalculateOptionWeightsProps =
  | CalculateUserFieldAnswerWeightsProps
  | CalculateFieldAnswerWeightsProps;

export const calculateAggregateOptionWeights = ({
  ...args
}: CalculateOptionWeightsProps): { [key: string]: number } => {
  const optionCount: { [key: string]: number } = {};

  switch (args.type) {
    case "userFieldAnswer": {
      args.answers.forEach((a) => {
        if (a.answer.__typename === "OptionFieldAnswer") {
          a.answer.selections.forEach((o) => {
            optionCount[o.optionId] = (optionCount[o.optionId] || 0) + o.weight;
          });
        }
      });
      break;
    }
    case "fieldAnswer": {
      args.answers.forEach((a) => {
        a.AnswerOptionSelections.forEach((o) => {
          optionCount[o.fieldOptionId] = (optionCount[o.fieldOptionId] || 0) + o.weight;
        });
      });
      break;
    }
  }

  return optionCount;
};
