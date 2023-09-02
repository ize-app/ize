import { Dispatch, SetStateAction, useState } from "react";
import { CurrentUserProvider } from "../contexts/current_user_context";
import { Link, Outlet, useOutletContext } from "react-router-dom";
import { SETUP_SERVER_WIZARD, useWizard } from "../utils/wizard";

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
  const [formState, setFormState] = useState({});
  const { prev, next } = useWizard(SETUP_SERVER_WIZARD);

  return (
    <CurrentUserProvider>
      <Outlet context={{ formState, setFormState }} />
      {prev && <Link to={prev}>Previous</Link>}
      {next && (
        <div>
          {" "}
          <Link to={next}>Next</Link>
        </div>
      )}
    </CurrentUserProvider>
  );
};
