import { Dispatch, SetStateAction, useState } from "react";
import { CurrentUserProvider } from "../../contexts/current_user_context";
import { Link, Outlet, useOutletContext } from "react-router-dom";
import { useWizard } from "../../utils/wizard";
import { SETUP_SERVER_WIZARD } from "./setup_server_wizard";
import { Typography } from "@mui/material";

type FormState = {
  serverId: string;
};

type ContextType = {
  formState: FormState;
  setFormState: Dispatch<SetStateAction<FormState>>;
};

export function useFormState() {
  return useOutletContext<ContextType>();
}

export const SetupServerGroup = () => {
  const { prev, next, title, canNext, formState, setFormState } = useWizard(SETUP_SERVER_WIZARD);

  return (
    <CurrentUserProvider>
      <Typography variant="h1">{title}</Typography>
      <Outlet context={{ formState, setFormState }} />
      {prev && <Link to={prev}>Previous</Link>}
      {next && canNext(formState) && (
        <div>
          {" "}
          <Link to={next}>Next</Link>
        </div>
      )}
    </CurrentUserProvider>
  );
};
