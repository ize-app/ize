import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import {
  DiscordServerRolesDocument,
  ProcessConfigurationOption,
} from "../../graphql/generated/graphql";
import { useNewServerGroupWizardState } from "./newServerWizard";
import { useQuery } from "@apollo/client";
import { validatePositiveIntegerInput } from "../../utils/inputs";

const INITIAL_PROCESS_CONFIGURATION_OPTIONS = [
  {
    label: "Benevolent Dictator",
    value: ProcessConfigurationOption.BenevolentDictator,
    description: "Only you can approve requests or change process",
    requiresRole: false,
  },
  {
    label: "Trusted Advisor",
    value: ProcessConfigurationOption.TrustedAdvisors,
    description:
      "Choose a Discord @role that can response to requests, but only you can approved process edits.",
    requiresRole: true,
  },
  {
    label: "Full Decentralization",
    value: ProcessConfigurationOption.FullDecentralization,
    description:
      "Choose a Discord @role that can vote on both proposals and process changes.",
    requiresRole: true,
  },
];

export const DefineServerGroupProcesses = () => {
  const { formState, setFormState } = useNewServerGroupWizardState();
  const configurationOption = INITIAL_PROCESS_CONFIGURATION_OPTIONS.find(
    (option) => option.value === formState.processConfigurationOption,
  );

  const { data } = useQuery(DiscordServerRolesDocument, {
    variables: { serverId: formState.serverId! },
    skip: formState.serverId == null || !configurationOption?.requiresRole,
  });

  const roles = data?.discordServerRoles;

  return (
    <Stack spacing={2}>
      <FormControl>
        <RadioGroup
          aria-labelledby="initial-process-configuration"
          name="radio-buttons-group"
          value={formState.processConfigurationOption}
          onChange={(event) =>
            setFormState((prev) => ({
              ...prev,
              processConfigurationOption: event.target
                .value as ProcessConfigurationOption,
            }))
          }
        >
          {INITIAL_PROCESS_CONFIGURATION_OPTIONS.map((option) => {
            return (
              <FormControlLabel
                value={option.value}
                control={<Radio />}
                label={option.label}
              />
            );
          })}
        </RadioGroup>
      </FormControl>
      {roles && (
        <Stack direction="row" spacing={2}>
          <FormControl>
            <InputLabel id="select-server-role">Roles</InputLabel>
            <Select
              sx={{ minWidth: 160 }}
              labelId="select-server-role"
              id="select-server"
              value={formState.roleId ?? ""}
              label="Role"
              onChange={(event) => {
                setFormState((prev) => ({
                  ...prev,
                  roleId: event.target.value ?? "",
                }));
              }}
            >
              {roles.map((role) => (
                <MenuItem key={role.id} value={role.id}>
                  {role.name}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>
              Who get's to respond to requests on the server?
            </FormHelperText>
          </FormControl>
          <FormControl>
            <TextField
              label="Required Response Count"
              onChange={(event) => {
                const value = event.target.value
                  ? parseInt(validatePositiveIntegerInput(event.target.value))
                  : undefined;

                setFormState((prev) => ({
                  ...prev,
                  numberOfResponses: value,
                }));
              }}
              value={formState.numberOfResponses ?? ""}
            />
            <FormHelperText>
              Choose a number that is high enough to be secure.
            </FormHelperText>
          </FormControl>
        </Stack>
      )}
    </Stack>
  );
};
