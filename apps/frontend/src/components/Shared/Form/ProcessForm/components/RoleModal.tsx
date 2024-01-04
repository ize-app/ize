import Box from "@mui/material/Box";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Modal from "@mui/material/Modal";
import { AgentSummaryPartsFragment } from "@/graphql/generated/graphql";
import { Button } from "@mui/material";

import { NewAgentType } from "../types";
import { zodResolver } from "@hookform/resolvers/zod";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import TextField from "@mui/material/TextField";
import { newAgentFormSchema } from "../formSchema";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
// import { DevTool } from "@hookform/devtools";

type FormFields = z.infer<typeof newAgentFormSchema>;

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

interface RoleModalProps {
  open: boolean;
  setOpen: (x: boolean) => void;
  onSubmit: (value: AgentSummaryPartsFragment[]) => void;
}

export function RoleModal({ open, setOpen, onSubmit: _sideEffects }: RoleModalProps) {
  const handleClose = () => {
    setOpen(false);
  };

  const { control, handleSubmit, watch } = useForm<FormFields>({
    defaultValues: {
      type: NewAgentType.Email,
      ethAddress: [],
      emailAddress: [],
    },
    resolver: zodResolver(newAgentFormSchema),
    shouldUnregister: true,
  });

  const onSubmit = (data: FormFields) => {
    console.log("submitted new agent", data);
  };

  const inputType = watch("type");

//   const testOption = {
//     __typename: "Identity",
//     id: "1234",
//     name: "ayyyyyyy",
//     icon: null,
//     identityType: {
//       __typename: "IdentityBlockchain",
//       id: "c434b088-d2f2-4a3a-ae85-416851c22d49",
//       address: "0x03f33bb5e7ca4fee122b1b443cebf2ed265c434a",
//     },
//   };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="role-selection-modal"
      aria-describedby="role-selection-modal"
    >
      <Box sx={style}>
        <form>
          <Controller
            name={"type"}
            control={control}
            render={({ field, fieldState: { error } }) => (
              <FormControl>
                <ToggleButtonGroup {...field} exclusive aria-label="new-agent-type-selector">
                  <ToggleButton value={NewAgentType.Email} aria-label="email-role">
                    Email
                  </ToggleButton>
                  <ToggleButton value={NewAgentType.EthAddress} aria-label="eth-address-role">
                    ETH
                  </ToggleButton>
                </ToggleButtonGroup>
                <FormHelperText
                  sx={{
                    color: "error.main",
                  }}
                >
                  {error?.message ?? ""}
                </FormHelperText>
              </FormControl>
            )}
          />
          {inputType === NewAgentType.EthAddress && (
            <Box>
              <Controller
                name={"ethAddress"}
                control={control}
                render={({ field, fieldState: { error } }) => {
                  return (
                    <FormControl>
                      <TextField
                        {...field}
                        label={"ETH addresses"}
                        required
                        error={Boolean(error)}
                        placeholder="Enter Eth address (or multiple addresses seperated by commas)"
                      />
                      <FormHelperText
                        sx={{
                          color: "error.main",
                        }}
                      >
                        {error?.message ?? ""}
                      </FormHelperText>
                    </FormControl>
                  );
                }}
              />
              <Button onClick={handleSubmit(onSubmit)}>Submit</Button>
            </Box>
          )}
          {inputType === NewAgentType.Email && (
            <Box>
              <Controller
                name={"emailAddress"}
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <FormControl>
                    <TextField
                      {...field}
                      label={"Email addresses"}
                      required
                      error={Boolean(error)}
                      placeholder="Enter email address (or multiple addresses seperated by commas)"
                    />
                    <FormHelperText
                      sx={{
                        color: "error.main",
                      }}
                    >
                      {error?.message ?? ""}
                    </FormHelperText>
                  </FormControl>
                )}
              />
              <Button onClick={handleSubmit(onSubmit)}>Submit</Button>
            </Box>
          )}
        </form>
      </Box>
    </Modal>
  );
}
