import { useQuery } from "@apollo/client";
import { DiscordServersDocument } from "../../graphql/generated/graphql";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { useSetupServerGroupWizardState } from "./setup_server_wizard";

interface DiscordServerProps {
  name: string;
  id: string;
}

export const DiscordUserServers = () => {
  const { formState, setFormState } = useSetupServerGroupWizardState();

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
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        alignItems: "flex-start",
      }}
    >
      <Typography variant="body1">
        Welcome! <br />
        <br />
        Select the server you want to create Cults groups for.
      </Typography>

      <FormControl sx={{ minWidth: "300px" }}>
        <InputLabel id="select-server-label">Server</InputLabel>
        <Select
          labelId="select-server-label"
          id="select-server"
          value={formState.serverId ?? ""}
          label="Server"
          onChange={(event) => {
            const serverId = event.target.value;
            const serverName =
              servers.find(
                (server: DiscordServerProps) => server.id === serverId,
              )?.name ?? "";
            setFormState((prev) => ({
              ...prev,
              serverId: serverId ?? "",

              serverName: serverName,
            }));
          }}
        >
          {servers.map((server) => (
            <MenuItem key={server.id} value={server.id} sx={{ width: "100%" }}>
              {server.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};
