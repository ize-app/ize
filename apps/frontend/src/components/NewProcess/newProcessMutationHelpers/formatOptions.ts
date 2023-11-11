import {
  OptionType,
  ProcessOptionArgs,
} from "../../../graphql/generated/graphql";
import { DefaultOptionSets, FormOptionChoice } from "../newProcessWizard";

export const formatOptions = (
  selectedOptionSet: FormOptionChoice,
  customOptions: string[],
): ProcessOptionArgs[] => {
  if (selectedOptionSet === FormOptionChoice.Custom)
    return customOptions.map((option) => ({
      value: option,
      type: OptionType.Text,
    }));
  else {
    return DefaultOptionSets.get(selectedOptionSet)
      ?.data as ProcessOptionArgs[];
  }
};
