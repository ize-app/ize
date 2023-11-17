import { SelectOption } from "../../SelectControl";
import {
  DefaultOptionSets,
  FormOptionChoice,
  defaultWebhookTriggerOption,
} from "@/components/shared/Form/ProcessForm/types";

const getOptionSet = ({
  optionType,
  customOptions,
}: {
  optionType: string;
  customOptions: string[];
}): string[] => {
  const optionTypeCast = optionType as FormOptionChoice;

  const options: string[] =
    optionTypeCast === FormOptionChoice.Custom
      ? customOptions ?? []
      : DefaultOptionSets.get(optionTypeCast)?.data.map(
          (option) => option.value,
        ) ?? [];
  return options;
};

export const webhookTriggerFilterOptions = ({
  optionType,
  customOptions,
}: {
  optionType: string;
  customOptions: string[];
}): SelectOption[] => {
  // react hook form converts everything to a string and the enum type is lost

  const options = getOptionSet({ optionType, customOptions }).map((option) => ({
    value: option,
    name: option,
  }));

  options.unshift(defaultWebhookTriggerOption);

  return options;
};
