import { OptionSelectionArgs } from "@/graphql/generated/resolver-types";
import { ApolloServerErrorCode, GraphQLError } from "@graphql/errors";

export type OptionSelectionWithOptionId = Omit<OptionSelectionArgs, "optionIndex"> & {
  optionId: string;
};

export const getOptionArgsWithOptionId = ({
  optionSelections,
  availableOptionIds,
  fieldId,
}: {
  optionSelections: OptionSelectionArgs[];
  availableOptionIds: string[];
  fieldId: string;
}): OptionSelectionWithOptionId[] =>
  optionSelections.map((optionSelection) => {
    let optionId: string;
    if (optionSelection.optionId) optionId = optionSelection.optionId;
    else {
      if (!optionSelection.optionIndex)
        throw new GraphQLError(`No option index or optionId provided for option selection`, {
          extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
        });
      optionId = availableOptionIds[optionSelection.optionIndex];

      if (!optionId)
        throw new GraphQLError(
          `Out of range optionIndex provided for answer to fieldId: ${fieldId}`,
          {
            extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
          },
        );
    }
    return {
      weight: optionSelection.weight,
      optionId,
    };
  });
