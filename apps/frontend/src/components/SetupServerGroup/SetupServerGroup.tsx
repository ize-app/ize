import { CurrentUserProvider } from "../../contexts/current_user_context";
import { Link, Outlet } from "react-router-dom";
import { useWizard } from "../../utils/wizard";
import { SETUP_SERVER_WIZARD } from "./setup_server_wizard";
import { Box, Stack, Typography } from "@mui/material";

export const SetupServerGroup = () => {
  const { prev, next, title, canNext, formState, setFormState } =
    useWizard(SETUP_SERVER_WIZARD);

  return (
    <CurrentUserProvider>
      <Typography variant="h1">{title}</Typography>
      <Box minHeight="500px">
        <Outlet context={{ formState, setFormState }} />
      </Box>
      <Stack direction="row" justifyContent="space-between">
        {prev ? (
          <div>
            {" "}
            <Link to={prev}>Previous</Link>
          </div>
        ) :  /** To keep next on the right when there is no prev we render an empty div */ <div />}
        {next && canNext(formState) && (
          <div>
            {" "}
            <Link to={next}>Next</Link>
          </div>
        )}
      </Stack>
    </CurrentUserProvider >
  );
};
