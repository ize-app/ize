import { RequestDefinedOptionSetPrismaType } from "../../request/requestPrismaTypes";
import { FieldOptionsConfigPrismaType } from "../fieldPrismaTypes";

export const getAvailableOptionIds = ({
  optionsConfig,
  requestDefinedOptionSets,
}: {
  optionsConfig: FieldOptionsConfigPrismaType;
  requestDefinedOptionSets: RequestDefinedOptionSetPrismaType[] | undefined;
}): string[] => {
  const options: string[] = [];

  (optionsConfig.PredefinedOptionSet?.FieldOptions ?? []).forEach((option) =>
    options.push(option.id),
  );

  (requestDefinedOptionSets ?? [])
    .filter((s) => s.fieldId === optionsConfig.fieldId)
    .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
    .forEach((s) => {
      s.FieldOptionSet.FieldOptions.forEach((option) => options.push(option.id));
    });

  return options;
};
