import { useMutation } from "@apollo/client";
import { Box, FormHelperText } from "@mui/material";
import { useState } from "react";
import { Controller, FieldValues, Path, useFormContext } from "react-hook-form";

import { Status, TestWebhookDocument } from "@/graphql/generated/graphql";

import { WebhookTestButton } from "./WebhookTestButton";
import { createTestWebhookArgs } from "../../FlowForm/helpers/createTestWebhookArgs";
import { TextField } from "../TextField";

interface WebhookFieldProps<T extends FieldValues> {
  name: Path<T>;
  required?: boolean;
  type: "notification" | "result";
}

export const WebhookField = <T extends FieldValues>({
  name,
  type,
  required = false,
}: WebhookFieldProps<T>): JSX.Element => {
  const { control, getValues, setValue } = useFormContext<T>();
  const [testWebhookStatus, setTestWebhookStatus] = useState<Status | null>(null);
  const [testWebhook] = useMutation(TestWebhookDocument, {});
  const handleTestWebhook = async (_event: React.MouseEvent<HTMLElement>) => {
    // @ts-expect-error TODO: figure out how to bring in webhook schema
    const uri = getValues(`${name}.uri`);
    setTestWebhookStatus(Status.InProgress);
    let success = false;
    try {
      if (type === "result") {
        const res = await testWebhook({
          variables: {
            // @ts-expect-error TODO: figure out how to bring in webhook schema
            inputs: createTestWebhookArgs(getValues(), uri),
          },
        });
        success = res.data?.testWebhook ?? false;
      }
      // @ts-expect-error TODO: figure out how to bring in webhook schema
      setValue(`${name}.valid`, success);

      setTestWebhookStatus(success ? Status.Completed : Status.Failure);
    } catch (e) {
      console.log("Test webhook error: ", e);
    }
  };

  const helperText = `${type === "notification" ? "For each flow that this group watches, a notification will be sent to this webhook." : ""}`;

  return (
    <Controller
      name={name}
      control={control}
      render={({ fieldState: { error } }) => {
        return (
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Box
              sx={{
                display: "flex",
                gap: "8px",
                alignItems: "flex-start",
                justifyContent: "flex-start",
              }}
            >
              <TextField<T>
                label="Url"
                size="small"
                required={required}
                showLabel={false}
                aria-label={`${type === "notification" ? "Notification webhook" : "Results webhook"}`}
                placeholderText={`${type === "notification" ? "Notification webhook" : "Results webhook"}`}
                // @ts-expect-error TODO: figure out how to bring in webhook schema
                name={`${name}.uri`}
              />
              <TextField<T>
                label="Webhook id"
                diabled
                size="small"
                showLabel={false}
                display={false}
                placeholderText="Valid webhook"
                // @ts-expect-error TODO: figure out how to bring in webhook schema
                name={`${name}.webhookId`}
              />
              <TextField<T>
                label="Original uri"
                diabled
                size="small"
                showLabel={false}
                display={false}
                placeholderText="Original uri"
                // @ts-expect-error TODO: figure out how to bring in webhook schema
                name={`${name}.originalUri`}
              />
              <TextField<T>
                label="Valid webhook"
                size="small"
                showLabel={false}
                disabled
                display={false}
                placeholderText="Valid webhook"
                // @ts-expect-error TODO: figure out how to bring in webhook schema
                name={`${name}.valid`}
              />
              <WebhookTestButton
                testWebhookStatus={testWebhookStatus}
                handleTestWebhook={handleTestWebhook}
              />
            </Box>
            <FormHelperText
              sx={{
                color: error?.root?.message ? "error.main" : undefined,
              }}
            >
              {error?.root?.message ?? helperText ?? ""}
            </FormHelperText>
          </Box>
        );
      }}
    />
  );
};
