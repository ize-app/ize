import { DefaultOptionSets, FormOptionChoice } from "@/components/shared/Form/ProcessForm/types";
import { ProcessOption } from "@/graphql/generated/graphql";

export const createOptionFormState = (options: ProcessOption[]): string[] => {
  return options.map((value) => value.value);
};

// There are default option sets in the UI for convenience
// This function figures out whether the option data in the db corresponds to those defualt option sets
export const getDefaultOptionSet = (options: ProcessOption[]): FormOptionChoice => {
  const sortedOptions = JSON.stringify(options.map((option) => option.value).sort());

  let matchKey;

  DefaultOptionSets.forEach((val, key) => {
    if (JSON.stringify(val.data.map((option) => option.value).sort()) === sortedOptions)
      matchKey = key;
  });

  return matchKey ?? FormOptionChoice.Custom;
};
