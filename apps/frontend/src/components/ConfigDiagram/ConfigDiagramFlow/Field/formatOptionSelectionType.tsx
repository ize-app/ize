import { FieldOptionsSelectionType } from "@/graphql/generated/graphql";

export const formatOptionSelectionType = ({
  type,
  maxSelections,
}: {
  type: FieldOptionsSelectionType;
  maxSelections?: number | null | undefined;
}): string => {
  switch (type) {
    case FieldOptionsSelectionType.Select:
      return `Select one option`;
    case FieldOptionsSelectionType.MultiSelect:
      return `Select up to ${maxSelections ?? 1} options`;
    case FieldOptionsSelectionType.Rank:
      return `Rank options`;
  }
};
