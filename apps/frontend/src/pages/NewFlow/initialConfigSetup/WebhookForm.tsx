import { Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

import { stringifyFreeInputValue } from "@/components/Field/stringifyFreeInputValue";
import { ButtonGroupField, TextField } from "@/components/Form/formFields";
import AsyncSelect from "@/components/Form/formFields/AsyncSelect";
import { SelectOption } from "@/components/Form/formFields/Select";
import { FieldBlockFadeIn } from "@/components/Form/formLayout/FieldBlockFadeIn";
import { FieldDataType } from "@/graphql/generated/graphql";

import { ActionTriggerCondition, IntitialFlowSetupSchemaType } from "../formValidation";
import { DecisionForm } from "./DecisionForm";

export const WebhookForm = () => {
  const { watch, setValue, getValues } = useFormContext<IntitialFlowSetupSchemaType>();
  const [filterOptions, setFilterOptions] = useState<SelectOption[]>([]);

  const webhookName = watch("webhookName");
  const webhookTriggerCondition = watch("webhookTriggerCondition");
  const question = watch("question");

  useEffect(() => {
    if (webhookTriggerCondition === ActionTriggerCondition.Decision) {
      console.log("setting options");
      setValue("optionsConfig", {
        options: [
          { optionId: crypto.randomUUID(), name: "✅", dataType: FieldDataType.String },
          { optionId: crypto.randomUUID(), name: "❌", dataType: FieldDataType.String },
        ],
        triggerDefinedOptions: undefined,
        linkedOptions: { hasLinkedOptions: false },
      });
    } else {
      setValue("optionsConfig", undefined);
      setValue("decision", undefined);
      setValue("question", undefined);
    }
  }, [webhookTriggerCondition]);

  useEffect(() => {
    refreshOptions();
  }, []);

  const refreshOptions = () => {
    const options = (getValues("optionsConfig.options") ?? []).map((option) => ({
      name:
        stringifyFreeInputValue({ value: option.name as string, dataType: option.dataType }) ?? "",
      value: option.optionId,
    }));
    setFilterOptions(options);
  };

  // refreshOptions();

  // const defaultOption: SelectOption = {
  //   name: "Action runs for every result",
  //   value: DefaultOptionSelection.None,
  // };
  // const filterOptions: SelectOption[] = options.map((option) => ({
  //   name: option.name,
  //   value: option.optionId,
  // }));

  // filterOptions.unshift(defaultOption);

  return (
    <>
      <FieldBlockFadeIn>
        <Typography variant="description">
          In the next step, you&apos;ll set up this integration with a webhook. What will this
          webhook do?
        </Typography>
        <TextField<IntitialFlowSetupSchemaType>
          // assuming here that results to fields is 1:1 relationshp
          name={`webhookName`}
          multiline
          placeholderText={"Posts tweet on shared Twitter"}
          label={`Webhook name`}
          defaultValue=""
        />
        {/* <WebhookURIForm<IntitialFlowSetupSchemaType> fieldName={`webhook`} /> */}
      </FieldBlockFadeIn>
      {webhookName && (
        <FieldBlockFadeIn>
          <Typography variant="description">When should the other tool be triggered?</Typography>
          <ButtonGroupField<IntitialFlowSetupSchemaType>
            label="When should this action happen?"
            name={`webhookTriggerCondition`}
            options={[
              {
                name: "Whenever someone triggers this flow",
                value: ActionTriggerCondition.None,
              },
              {
                name: "Only after a decision",
                value: ActionTriggerCondition.Decision,
              },
            ]}
          />
        </FieldBlockFadeIn>
      )}
      {webhookTriggerCondition === ActionTriggerCondition.Decision && (
        <>
          <DecisionForm />

          {!!question && (
            <>
              <FieldBlockFadeIn>
                <Typography variant="description">
                  Which option will this webhook be triggered for?
                </Typography>
                <AsyncSelect<IntitialFlowSetupSchemaType, string>
                  label="Default option"
                  variant="standard"
                  name={`filterOptionId`}
                  getOptionLabel={(option) => {
                    return filterOptions.find((o) => o.value === option)?.name ?? "";
                  }}
                  sx={{ maxWidth: "300px", width: "200px" }}
                  isOptionEqualToValue={(option, value) => option === value}
                  loading={false}
                  options={filterOptions.map((option) => option.value as string)}
                  fetchOptions={() => {
                    refreshOptions();
                  }}
                />
              </FieldBlockFadeIn>
            </>
          )}
        </>
      )}
    </>
  );
};
