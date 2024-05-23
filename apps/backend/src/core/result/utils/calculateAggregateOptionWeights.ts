import { FieldAnswerPrismaType } from "@/core/fields/fieldPrismaTypes";

// generic function for determining relative priority between options
// for a single select or multiselect, all weights will be 1, so this is effectively an option count
// for a ranking, there are higher weights for higher ranked options
export const calculateAggregateOptionWeights = ({
  answers,
}: {
  answers: FieldAnswerPrismaType[];
}): { [key: string]: number } => {
  const optionCount: { [key: string]: number } = {};

  answers.forEach((a) => {
    a.AnswerOptionSelections.forEach((o) => {
      optionCount[o.fieldOptionId] = (optionCount[o.fieldOptionId] || 0) + o.weight;
    });
  });
  return optionCount;
};
