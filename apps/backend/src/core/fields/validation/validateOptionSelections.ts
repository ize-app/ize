import { OptionSelectionType } from "@prisma/client";

import { ApolloServerErrorCode, GraphQLError } from "@graphql/errors";

import { FieldOptionsConfigPrismaType } from "../fieldPrismaTypes";
import { OptionSelectionWithOptionId } from "./getOptionArgsWithOptionId";

const sumUpTo = (n: number) => {
  return (n * (n + 1)) / 2;
};

function hasDuplicateIds(selections: OptionSelectionWithOptionId[]) {
  const seenIds = new Set();
  for (const option of selections) {
    if (seenIds.has(option.optionId)) {
      return true; // Duplicate found
    }
    seenIds.add(option.optionId);
  }
  return false; // No duplicates
}
const hasInvalidOptionId = (
  selections: OptionSelectionWithOptionId[],
  availableOptionIds: string[],
): boolean => {
  return selections.some((selection) => !availableOptionIds.includes(selection.optionId));
};

export const validateOptionSelections = ({
  selections,
  optionsConfig,
  availableOptionIds,
  fieldId,
}: {
  selections: OptionSelectionWithOptionId[];
  optionsConfig: FieldOptionsConfigPrismaType;
  availableOptionIds: string[];
  fieldId: string;
}): void => {
  const { selectionType, maxSelections } = optionsConfig;

  if (maxSelections && selections.length > maxSelections)
    throw new GraphQLError(`More option selections submitted than allowable for field ${fieldId}`, {
      extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
    });

  if (hasDuplicateIds(selections))
    throw new GraphQLError(`Duplicate option ids found in options`, {
      extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
    });

  if (hasInvalidOptionId(selections, availableOptionIds))
    throw new GraphQLError(
      `Option selection is not part of available option set for field ${fieldId}`,
      {
        extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
      },
    );

  switch (selectionType) {
    case OptionSelectionType.Rank: {
      const totalOptionCount = selections.length;
      const totalWeight = selections.reduce((acc, { weight }) => acc + weight, 0);
      const expectedTotalWeight = sumUpTo(totalOptionCount);
      if (totalWeight !== expectedTotalWeight)
        throw new GraphQLError(
          `Option weight error for ${selectionType} Total weight of options (${totalWeight}) does not match expected total weight (${expectedTotalWeight}) for field ${fieldId}`,
          {
            extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
          },
        );
      return;
    }
    case OptionSelectionType.Select: {
      if (selections.length !== 1)
        throw new GraphQLError(
          `Option selection error ${selectionType}: Total selections should be 1, but got ${selections.length} for field ${fieldId}`,
          {
            extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
          },
        );

      selections.forEach(({ weight }) => {
        if (weight !== 1)
          throw new GraphQLError(
            `Option weight error for ${selectionType}: Option weight should be 1, but got ${weight} for field ${fieldId}`,
            {
              extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
            },
          );
      });
      return;
    }
    case OptionSelectionType.MultiSelect:
      {
        if (selections.length > availableOptionIds.length)
          throw new GraphQLError(
            `Option selection error ${selectionType}: Total option selections exceeds number of available options for field ${fieldId}`,
            {
              extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
            },
          );

        selections.forEach(({ weight }) => {
          if (weight !== 1)
            throw new GraphQLError(
              `Option weight error for ${selectionType}: Option weight should be 1, but got ${weight} for field ${fieldId}`,
              {
                extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
              },
            );
        });
      }
      return;
  }
};
