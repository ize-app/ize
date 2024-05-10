import { UseFormReturn } from "react-hook-form";

import { FlowSchemaType } from "../formValidation/flow";
import { Select, TextField } from "../../formFields";
import { useEffect } from "react";

import {
  ActionType,
  FieldType,
  ResultType,
  TestWebhookDocument,
} from "@/graphql/generated/graphql";
import { DefaultOptionSelection } from "../formValidation/fields";
import { SelectOption } from "../../formFields/Select";
import { getSelectOptionName } from "../../utils/getSelectOptionName";
import { Box, Button, FormHelperText } from "@mui/material";
import { PanelAccordion } from "../../../ConfigDiagram/ConfigPanel/PanelAccordion";
import { useMutation } from "@apollo/client";
import { createTestWebhookArgs } from "../helpers/createTestWebhookArgs";

interface WebhookFormProps {
  formMethods: UseFormReturn<FlowSchemaType>;
  formIndex: number; // react-hook-form name
  show: boolean;
}

export const WebhookForm = ({ formMethods, formIndex, show }: WebhookFormProps) => {
  useEffect(() => {
    formMethods.setValue(`steps.${formIndex}.action.type`, ActionType.CallWebhook);
  }, []);

  const [testWebhook] = useMutation(TestWebhookDocument, {
    // onCompleted: (data) => {
    //   const { newFlow: newFlowId } = data;
    // },
  });

  const handleTestWebhook = async (_event: React.MouseEvent<HTMLElement>) => {
    const uri = formMethods.getValues(`steps.${formIndex}.action.callWebhook.uri`);
    try {
      const res = await testWebhook({
        variables: {
          inputs: createTestWebhookArgs(formMethods.getValues(), uri),
        },
      });
      console.log("Test webhook response: ", res); // TODO: delete
    } catch (e) {
      console.log("Test webhook error: ", e);
    }
  };

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

  const webhookError = formMethods.formState.errors.steps?.[formIndex]?.action;

  return (
    <Box sx={{ display: show ? "box" : "none" }}>
      <PanelAccordion title="Setup" hasError={!!webhookError}>
        {!!webhookError?.root && (
          <FormHelperText
            sx={{
              color: "error.main",
            }}
          >
            {webhookError.root?.message}
          </FormHelperText>
        )}
        {(options ?? []).length > 0 && actionType !== ActionType.None && (
          <>
            <Select<FlowSchemaType>
              control={formMethods.control}
              label="When to run action"
              renderValue={(val) => {
                const optionName = getSelectOptionName(options, val);
                if (optionName) {
                  return "Only run action on: " + optionName;
                } else return "Run action on all options";
              }}
              selectOptions={defaultOptionSelections}
              displayLabel={false}
              name={`steps.${formIndex}.action.filterOptionId`}
            />
          </>
        )}
        <TextField<FlowSchemaType>
          control={formMethods.control}
          label="What does this webhook do?"
          placeholderText="What does this webhook do?"
          size="small"
          showLabel={false}
          name={`steps.${formIndex}.action.callWebhook.name`}
        />
        <Box sx={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <TextField<FlowSchemaType>
            control={formMethods.control}
            label="Url"
            size="small"
            showLabel={false}
            placeholderText="Webhook Uri (not displayed publicly)"
            name={`steps.${formIndex}.action.callWebhook.uri`}
          />
          <Button
            variant="outlined"
            sx={{ width: "60px" }}
            size={"small"}
            onClick={handleTestWebhook}
          >
            Test
          </Button>
        </Box>
      </PanelAccordion>
    </Box>
  );
};
