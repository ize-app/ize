import { Box, FormHelperText, Typography } from "@mui/material";
import { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";

import { ActionType } from "@/graphql/generated/graphql";

import { ActionFilterForm } from "./ActionFilterForm";
import { PanelAccordion } from "../../../ConfigDiagram/ConfigPanel/PanelAccordion";
import { TextField } from "../../formFields";
import { WebhookField } from "../../formFields/WebhookField";
import { DefaultOptionSelection } from "../formValidation/fields";
import { FlowSchemaType } from "../formValidation/flow";

interface WebhookFormProps {
  formMethods: UseFormReturn<FlowSchemaType>;
  formIndex: number; // react-hook-form name
  show: boolean;
}

export const WebhookForm = ({ formMethods, formIndex, show }: WebhookFormProps) => {
  useEffect(() => {
    formMethods.setValue(`steps.${formIndex}.action.type`, ActionType.CallWebhook);
    formMethods.setValue(`steps.${formIndex}.action.filterOptionId`, DefaultOptionSelection.None);
  }, []);

  const webhookError = formMethods.formState.errors.steps?.[formIndex]?.action;

  return (
    <Box sx={{ display: show ? "box" : "none" }}>
      <ActionFilterForm
        formMethods={formMethods}
        formIndex={formIndex}
        actionType={ActionType.CallWebhook}
      />
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
        <TextField<FlowSchemaType>
          control={formMethods.control}
          label="What does this webhook do?"
          placeholderText="What does this webhook do?"
          size="small"
          showLabel={false}
          name={`steps.${formIndex}.action.callWebhook.name`}
        />
        <Typography>
          This webhook will only be viewable by users who have rights to request an evolution for
          this flow.
        </Typography>
        <WebhookField formMethods={formMethods} name={`steps.${formIndex}.action.callWebhook`} />
      </PanelAccordion>
    </Box>
  );
};
