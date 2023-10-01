import Box from "@mui/material/Box";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import TextField from "@mui/material/TextField";

import { useSetupProcessWizardState } from "./setupProcessWizard";

import { useState } from "react";

export const ProcessIntro = () => {
  const { formState, setFormState } = useSetupProcessWizardState();
  const [showWebhookInput, setShowWebhookInput] = useState(false);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <TextField
        label="Title"
        placeholder="e.g. Approve expense"
        value={formState.processName}
        onChange={(event) =>
          setFormState((prev) => ({ ...prev, processName: event.target.value }))
        }
        required
      />
      <TextField
        multiline
        minRows={2}
        label="Description"
        placeholder="e.g. Approves any expense under $100 via Expensify integration"
        value={formState.description}
        onChange={(event) =>
          setFormState((prev) => ({ ...prev, description: event.target.value }))
        }
        required
      />
      <FormControl required>
        <FormLabel id="radio-buttons-group-label">
          Do you want a custom integration to execute everytime this process is
          triggered?{" "}
        </FormLabel>
        <RadioGroup
          row
          aria-labelledby="radio-buttons-group"
          name="row-radio-buttons-group"
          onChange={(event) =>
            setShowWebhookInput(event.target.value === "yes" ? true : false)
          }
        >
          <FormControlLabel value={"yes"} control={<Radio />} label="Yes" />
          <FormControlLabel value={"no"} control={<Radio />} label="No" />
        </RadioGroup>
      </FormControl>
      {showWebhookInput && (
        <TextField
          label="Webhook URI for custom integrations"
          placeholder="e.g. Approve expense"
          value={formState.webhookUri}
          onChange={(event) => {
            setFormState((prev) => ({
              ...prev,
              webhookUri: event.target.value,
            }));
          }}
          required
          error={false}
          helperText={
            "Use this webhook to build integrations with tools like Zapier and Pipedream"
          }
        />
      )}
      <FormControl required>
        <FormLabel id="radio-buttons-group-label">
          What options will respondants to this process choose between?
        </FormLabel>
        <RadioGroup
          row
          aria-labelledby="radio-buttons-group"
          name="row-radio-buttons-group"
        >
          <FormControlLabel
            value={"Yes/no emojiis"}
            control={<Radio />}
            label="✅ ❌"
          />
          <FormControlLabel
            value={"Face emojiis"}
            control={<Radio />}
            label="😃 😐 😭"
          />
          <FormControlLabel
            value={"Custom"}
            control={<Radio />}
            label="Custom"
          />
        </RadioGroup>
      </FormControl>
    </Box>
  );
};
