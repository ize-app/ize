import { FormControl, FormControlLabel, Radio, RadioGroup } from "@mui/material"
import { ProcessConfigurationOption } from "../../graphql/generated/graphql";
import { useSetupServerGroupWizardState } from "./setup_server_wizard";

const INITIAL_PROCESS_CONFIGURATION_OPTIONS = [
  {
    label: "Benevolent Dictator",
    value: ProcessConfigurationOption.BenevolentDictator,
    description: "Only you can approve requests or change process",
  },
  {
    label: "Trusted Advisor",
    value: ProcessConfigurationOption.TrustedAdvisors,
    description: "Choose a Discord @role that can response to requests, but only you can approved process edits.",
  },
  {
    label: "Full Decentralization",
    value: ProcessConfigurationOption.FullDecentralization,
  }
];

export const DefineServerGroupProcesses = () => {
  const { formState, setFormState } = useSetupServerGroupWizardState();

  return <FormControl>
    <RadioGroup
      aria-labelledby="initial-process-configuration"
      name="radio-buttons-group"
      value={formState.processConfigurationOption}
      onChange={(event) => setFormState((prev) => ({ ...prev, processConfigurationOption: event.target.value as ProcessConfigurationOption }))}
    >
      {INITIAL_PROCESS_CONFIGURATION_OPTIONS.map((option) => {
        return <FormControlLabel value={option.value} control={<Radio />} label={option.label} />
      })}
    </RadioGroup>
  </FormControl >
}
