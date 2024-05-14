import { UseFormReturn } from "react-hook-form";

import { FlowSchemaType } from "../formValidation/flow";
import { TextField } from "../../formFields";
import { useEffect, useState } from "react";

import { ActionType, TestWebhookDocument } from "@/graphql/generated/graphql";
import { DefaultOptionSelection } from "../formValidation/fields";
import { Box, Button, FormHelperText } from "@mui/material";
import { PanelAccordion } from "../../../ConfigDiagram/ConfigPanel/PanelAccordion";
import { useMutation } from "@apollo/client";
import { createTestWebhookArgs } from "../helpers/createTestWebhookArgs";
import { Status } from "@/graphql/generated/graphql";
import { statusProps } from "@/components/status/statusProps";
import { ActionFilterForm } from "./ActionFilterForm";

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

  const [testWebhookStatus, setTestWebhookStatus] = useState<Status | null>(null);

  const WebhookStatusIcon = testWebhookStatus
    ? statusProps[testWebhookStatus].icon
    : statusProps.NotAttempted.icon;

  const [testWebhook] = useMutation(TestWebhookDocument, {});

  const handleTestWebhook = async (_event: React.MouseEvent<HTMLElement>) => {
    const uri = formMethods.getValues(`steps.${formIndex}.action.callWebhook.uri`);
    setTestWebhookStatus(Status.InProgress);
    try {
      const res = await testWebhook({
        variables: {
          inputs: createTestWebhookArgs(formMethods.getValues(), uri),
        },
      });
      const success = res.data?.testWebhook ?? false;
      formMethods.setValue(`steps.${formIndex}.action.callWebhook.valid`, success);
      setTestWebhookStatus(success ? Status.Completed : Status.Failure);
    } catch (e) {
      console.log("Test webhook error: ", e);
    }
  };

  const webhookError = formMethods.formState.errors.steps?.[formIndex]?.action;

  return (
    <Box sx={{ display: show ? "box" : "none" }}>
      <ActionFilterForm formMethods={formMethods} formIndex={formIndex} />
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
        <Box sx={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <TextField<FlowSchemaType>
            control={formMethods.control}
            label="Url"
            size="small"
            showLabel={false}
            placeholderText="Webhook Uri (not displayed publicly)"
            name={`steps.${formIndex}.action.callWebhook.uri`}
          />
          <TextField<FlowSchemaType>
            control={formMethods.control}
            label="Valid webhook"
            size="small"
            showLabel={false}
            display={false}
            placeholderText="Valid webhook"
            name={`steps.${formIndex}.action.callWebhook.valid`}
          />
          <Button
            variant="outlined"
            sx={{ width: "60px" }}
            size={"small"}
            endIcon={
              <WebhookStatusIcon
                sx={{
                  color: testWebhookStatus
                    ? statusProps[testWebhookStatus].backgroundColor
                    : statusProps.NotAttempted.backgroundColor,
                }}
                // color={
                //   testWebhookStatus
                //     ? actionExecutionStatusProps[testWebhookStatus].color
                //     : actionExecutionStatusProps.NotAttempted.color
                // }
              />
            }
            onClick={handleTestWebhook}
          >
            Test
          </Button>
        </Box>
      </PanelAccordion>
    </Box>
  );
};
