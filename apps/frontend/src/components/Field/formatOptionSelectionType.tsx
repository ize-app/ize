import { OptionSelectionType } from "@/graphql/generated/graphql";

export const formatOptionSelectionType = ({
  type,
  maxSelections,
}: {
  type: OptionSelectionType;
  maxSelections?: number | null | undefined;
}): string => {
  switch (type) {
    case OptionSelectionType.Select:
      return `Select one option`;
    case OptionSelectionType.MultiSelect:
      return `Select up to ${maxSelections ?? 1} options`;
    case OptionSelectionType.Rank:
      return `Rank options`;
  }
};
