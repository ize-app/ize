import { DefaultOptionSets, FormOptionChoice } from "@/components/shared/Form/ProcessForm/types";
import { OptionType, ProcessOptionArgs } from "@/graphql/generated/graphql";

const createOptionInputs = (
  selectedOptionSet: FormOptionChoice,
  customOptions: string[],
): ProcessOptionArgs[] => {
  if (selectedOptionSet === FormOptionChoice.Custom)
    return customOptions.map((option) => ({
      value: option,
      type: OptionType.Text,
    }));
  else {
    return DefaultOptionSets.get(selectedOptionSet)?.data as ProcessOptionArgs[];
  }
};

export default createOptionInputs;
