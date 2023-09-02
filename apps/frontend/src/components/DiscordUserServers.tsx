import { useQuery } from "@apollo/client";
import { DiscordServersDocument } from "../graphql/generated/graphql";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { useFormState } from "./SetupServerGroup";

export const DiscordUserServers = () => {
  const { formState, setFormState } = useFormState();

  const { data } = useQuery(DiscordServersDocument);

  const servers = data?.discordServers;

  if (!servers || servers.length === 0) {
    return (
      <div>
        It looks you you don't have any servers with the Cults Bot. Please add
        the Cults bot to your server and try again.
      </div>
    );
  }

  return (
    <Box>
      <Typography variant="h4">Create a group for a discord server</Typography>
      <Typography variant="body1">
        Choose which server you want to create a group for.
      </Typography>
      <FormControl>
        <InputLabel id="select-server-label">Server</InputLabel>
        <Select
          sx={{ minWidth: 160 }}
          labelId="select-server-label"
          id="select-server"
          value={formState.serverId ?? ""}
          label="Server"
          onChange={(event) => {
            setFormState((prev) => ({ ...prev, serverId: event.target.value ?? "" }));
          }}
          autoWidth
        >
          {servers.map((server) => (
            <MenuItem key={server.id} value={server.id}>
              {server.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};
