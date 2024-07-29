import { useMutation } from "@apollo/client";
import { Box } from "@mui/material";
import { useState } from "react";
import { FieldValues, UseControllerProps, UseFormReturn } from "react-hook-form";

import { Status, TestWebhookDocument } from "@/graphql/generated/graphql";

import { TextField } from "./TextField";
import { WebhookTestButton } from "./WebhookTestButton";
import { createTestWebhookArgs } from "../FlowForm/helpers/createTestWebhookArgs";

interface WebhookFieldProps<T extends FieldValues> extends UseControllerProps<T> {
  required?: boolean;
  formMethods: UseFormReturn<T>;
}

export const WebhookField = <T extends FieldValues>({
  name,
  //   label,
  required = false,
  formMethods,
}: WebhookFieldProps<T>): JSX.Element => {
  const [testWebhookStatus, setTestWebhookStatus] = useState<Status | null>(null);
  const handleTestWebhook = async (_event: React.MouseEvent<HTMLElement>) => {
    // @ts-expect-error TODO: figure out how to bring in webhook schema
    const uri = formMethods.getValues(`${name}.uri`);
    setTestWebhookStatus(Status.InProgress);
    try {
      const res = await testWebhook({
        variables: {
          // @ts-expect-error TODO: figure out how to bring in webhook schema
          inputs: createTestWebhookArgs(formMethods.getValues(), uri),
        },
      });
      const success = res.data?.testWebhook ?? false;
      // @ts-expect-error TODO: figure out how to bring in webhook schema
      formMethods.setValue(`${name}.valid`, success);
      setTestWebhookStatus(success ? Status.Completed : Status.Failure);
    } catch (e) {
      console.log("Test webhook error: ", e);
    }
  };
  const [testWebhook] = useMutation(TestWebhookDocument, {});
  return (
    <Box sx={{ display: "flex", gap: "8px", alignItems: "center" }}>
      <TextField<T>
        control={formMethods.control}
        label="Url"
        size="small"
        required={required}
        showLabel={false}
        placeholderText="Webhook Uri (not displayed publicly)"
        // @ts-expect-error TODO: figure out how to bring in webhook schema
        name={`${name}.uri`}
      />
      <TextField<T>
        control={formMethods.control}
        label="Valid webhook"
        size="small"
        showLabel={false}
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
  );
};

//   <Controller
//     name={name}
//     control={control}
//     render={({ field, fieldState: { error } }) => (
//       <FormControl error={Boolean(error)} required={required}>
//         <FormControlLabel
//           control={
//             <MuiCheckbox
//               {...field}
//               id={`checkbox-${name}`}
//               checked={field.value as boolean}
//               aria-label="label"
//             />
//           }
//           label={label}
//           labelPlacement="top"
//         />
//       </FormControl>
//     )}
//   />
