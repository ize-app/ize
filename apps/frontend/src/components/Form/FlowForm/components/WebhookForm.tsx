import { UseFormReturn } from "react-hook-form";

import { FlowSchemaType } from "../formValidation/flow";
import { Select, TextField } from "../../formFields";
import { ResponsiveFormRow } from "../../formLayout/ResponsiveFormRow";
import { useEffect } from "react";

import { ActionType, FieldType, ResultType } from "@/graphql/generated/graphql";
import { DefaultOptionSelection } from "../formValidation/fields";
import { SelectOption } from "../../formFields/Select";
import { StepContainer } from "./StepContainer";
import { getSelectOptionName } from "../../utils/getSelectOptionName";

interface WebhookFormProps {
  formMethods: UseFormReturn<FlowSchemaType>;
  formIndex: number; // react-hook-form name
  handleStepExpansion: (_event: React.SyntheticEvent, newExpanded: boolean) => void;
  expandedStep: string | false;
}

export const WebhookForm = ({
  formMethods,
  formIndex,
  handleStepExpansion,
  expandedStep,
}: WebhookFormProps) => {
  useEffect(() => {
    formMethods.setValue(`steps.${formIndex}.action.type`, ActionType.CallWebhook);
  }, []);
  const actionType = formMethods.watch(`steps.${formIndex}.action.type`);
  // const options = formMethods.watch(`steps.${formIndex}.response.field.optionsConfig.options`);
  const results = formMethods.watch(`steps.${formIndex}.result`);
  const responseFields = formMethods.watch(`steps.${formIndex}.response.fields`);

  const options: SelectOption[] = [];

  (results ?? [])
    .filter((res) => res.type === ResultType.Decision)
    .forEach((res, resIndex) => {
      const field = responseFields.find((f) => f.fieldId === res.fieldId);
      if (!field || field.type !== FieldType.Options) return;
      field.optionsConfig.options.map((o) => {
        options.push({
          name: `Result ${resIndex}: "${o.name}"`,
          value: o.optionId,
        });
      });
    });

  const defaultOptionSelections: SelectOption[] = [...options];

  defaultOptionSelections.unshift({
    name: "Action runs for every result",
    value: DefaultOptionSelection.None,
  });

  const hasError = !!formMethods.formState.errors.steps?.[formIndex]?.action;

  return (
    <StepContainer
      expandedStep={expandedStep}
      handleStepExpansion={handleStepExpansion}
      stepIdentifier={"webhook" + formIndex.toString()}
      hasError={hasError} // to fix
      title={`Call webhook`}
    >
      <ResponsiveFormRow>
        {(options ?? []).length > 0 && actionType !== ActionType.None && (
          <>
            <Select<FlowSchemaType>
              control={formMethods.control}
              label="When to run action"
              width="300px"
              renderValue={(val) => {
                const optionName = getSelectOptionName(options, val);
                if (optionName) {
                  return "Only run action on: " + optionName;
                } else return "Run action on all options";
              }}
              flexGrow="1"
              selectOptions={defaultOptionSelections}
              displayLabel={false}
              name={`steps.${formIndex}.action.filterOptionId`}
            />
          </>
        )}
      </ResponsiveFormRow>

      <ResponsiveFormRow>
        <TextField<FlowSchemaType>
          control={formMethods.control}
          sx={{ width: "300px" }}
          label="Url"
          variant="standard"
          size="small"
          showLabel={false}
          placeholderText="Webhook Uri (not displayed publicly)"
          name={`steps.${formIndex}.action.callWebhook.uri`}
        />
        <TextField<FlowSchemaType>
          control={formMethods.control}
          sx={{ width: "300px", flexGrow: 1 }}
          label="What does this webhook do?"
          placeholderText="What does this webhook do?"
          variant="standard"
          size="small"
          showLabel={false}
          name={`steps.${formIndex}.action.callWebhook.name`}
        />
      </ResponsiveFormRow>
    </StepContainer>
  );
};
