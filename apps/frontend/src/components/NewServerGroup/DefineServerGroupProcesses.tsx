import { useQuery } from "@apollo/client";
import { FormControl, FormHelperText, InputLabel, MenuItem, Select, Stack } from "@mui/material";

import { useNewServerGroupWizardState } from "./newServerWizard";
import { DiscordServerRolesDocument } from "../../graphql/generated/graphql";

export const DefineServerGroupProcesses = () => {
  const { formState, setFormState } = useNewServerGroupWizardState();

  const { data } = useQuery(DiscordServerRolesDocument, {
    variables: { serverId: formState.serverId! },
  });

  const roles = data?.discordServerRoles.filter(
    (role) => !role.botRole && role.name !== "@everyone",
  );

  return (
    <Stack spacing={2}>
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
            <FormHelperText>Who get's to respond to requests on the server?</FormHelperText>
          </FormControl>
        </Stack>
      )}
    </Stack>
  );
};
