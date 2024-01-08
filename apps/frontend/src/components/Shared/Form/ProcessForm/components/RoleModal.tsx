import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import {
  AgentSummaryPartsFragment,
  NewAgentsDocument,
  MutationNewAgentsArgs,
  NewAgentTypes,
} from "@/graphql/generated/graphql";
import { Button, Typography } from "@mui/material";
import { useMutation } from "@apollo/client";

// import { NewAgentType } from "../types";
import { zodResolver } from "@hookform/resolvers/zod";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import TextField from "@mui/material/TextField";
import { newAgentFormSchema } from "../formSchema";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { SelectControl } from "../..";
// import { DevTool } from "@hookform/devtools";

type FormFields = z.infer<typeof newAgentFormSchema>;

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "600px",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

interface RoleModalProps {
  open: boolean;
  setOpen: (x: boolean) => void;
  onSubmit: (value: AgentSummaryPartsFragment[]) => void;
  type: NewAgentTypes;
}

export function RoleModal({ open, setOpen, onSubmit, type }: RoleModalProps) {
  const [mutate] = useMutation(NewAgentsDocument, {
    onCompleted: (data) => {
      setOpen(false);
      onSubmit(data.newAgents);
    },
  });

  const handleClose = () => {
    setOpen(false);
  };

  const { control, handleSubmit, watch } = useForm<FormFields>({
    defaultValues: {
      type,
      ethAddress: [],
      emailAddress: [],
    },
    resolver: zodResolver(newAgentFormSchema),
    shouldUnregister: true,
  });

  const createAgents = async (data: FormFields) => {
    const createNewAgentArgs = (data: FormFields): MutationNewAgentsArgs => {
      return {
        agents: (data.emailAddress ?? data.ethAddress ?? []).map((val) => ({
          type: inputType,
          value: val,
        })),
      };
    };
    await mutate({
      variables: {
        agents: createNewAgentArgs(data).agents,
      },
    });
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
        <Typography variant="h2" sx={{ mb: "16px" }}>
          Add role
        </Typography>
        <form style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <SelectControl
            name="type"
            sx={{ width: "200px" }}
            //@ts-ignore
            control={control}
            label=""
            selectOptions={[
              { name: "Email address", value: NewAgentTypes.IdentityEmail },
              { name: "Eth address", value: NewAgentTypes.IdentityBlockchain },
            ]}
          />
          {inputType === NewAgentTypes.IdentityBlockchain && (
            <Box
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: "24px",
              }}
            >
              <Controller
                name={"ethAddress"}
                control={control}
                render={({ field, fieldState: { error } }) => {
                  return (
                    <FormControl sx={{ width: "100%" }}>
                      <TextField
                        {...field}
                        label={"ETH addresses"}
                        fullWidth
                        required
                        error={Boolean(error)}
                        placeholder="Enter an Eth address or list of addresses seperated by commas "
                      />
                      <FormHelperText
                        sx={{
                          color: error?.message ? "error.main" : "black",
                        }}
                      >
                        {error?.message ?? ""}
                      </FormHelperText>
                    </FormControl>
                  );
                }}
              />
              <Button onSubmit={handleSubmit(createAgents)} variant="contained">
                Submit
              </Button>
            </Box>
          )}
          {inputType === NewAgentTypes.IdentityEmail && (
            <Box
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: "24px",
              }}
            >
              <Controller
                name={"emailAddress"}
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <FormControl sx={{ width: "100%" }}>
                    <TextField
                      {...field}
                      label={"Email addresses"}
                      fullWidth
                      required
                      error={Boolean(error)}
                      placeholder="Enter an email or list of emails seperated by commas"
                    />
                    <FormHelperText
                      sx={{
                        color: error?.message ? "error.main" : "black",
                      }}
                    >
                      {error?.message ?? ""}
                    </FormHelperText>
                  </FormControl>
                )}
              />
              <Button type="submit" onSubmit={handleSubmit(createAgents)} variant="contained">
                Submit
              </Button>
            </Box>
          )}
        </form>
      </Box>
    </Modal>
  );
}
