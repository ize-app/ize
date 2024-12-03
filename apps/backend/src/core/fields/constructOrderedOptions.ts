import { FieldOptionPrismaType, FieldOptionsConfigPrismaType } from "./fieldPrismaTypes";
import { RequestDefinedOptionSetPrismaType } from "../request/requestPrismaTypes";

// constructs ordered list of field options for a field
// critical that this option list is ordered consistently
export const constructOrderedOptions = ({
  optionsConfig,
  requestDefinedOptionSets,
}: {
  optionsConfig: FieldOptionsConfigPrismaType;
  requestDefinedOptionSets: RequestDefinedOptionSetPrismaType[] | undefined;
}): FieldOptionPrismaType[] => {
  const options: FieldOptionPrismaType[] = [];

  (optionsConfig.PredefinedOptionSet?.FieldOptions ?? []).forEach((option) => options.push(option));

  (requestDefinedOptionSets ?? [])
    .filter((s) => s.fieldId === optionsConfig.fieldId)
    .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
    .forEach((s) => {
      s.FieldOptionSet.FieldOptions.forEach((option) => options.push(option));
    });

  return options;
};
