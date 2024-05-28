import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Typography } from "@mui/material";

import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import { useStytch } from "@stytch/react";
import { useCallback, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  emailAddress: z.string().trim().email(),
});

type FormFields = z.infer<typeof formSchema>;

const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "600px",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

interface LinkEmailModalProps {
  open: boolean;
  setOpen: (x: boolean) => void;
}

export function LinkEmailModal({ open, setOpen }: LinkEmailModalProps) {
  const stytchClient = useStytch();

  const [success, setSuccess] = useState(false);
  const [apiErrorMessage, setApiErrorMessage] = useState("");

  const handleClose = () => {
    setSuccess(false);
    setApiErrorMessage("");
    setOpen(false);
  };

  const authenticateEmail = useCallback(
    async (email: string) => {
      stytchClient.magicLinks.email.send(email, {
        login_expiration_minutes: 60,
        signup_expiration_minutes: 60,
        login_magic_link_url: "http://localhost:5173/settings",
        signup_magic_link_url: "http://localhost:5173/settings",
      });
    },
    [stytchClient],
  );

  const onSubmit = async (data: FormFields) => {
    try {
      await authenticateEmail(data.emailAddress);
      setSuccess(true);
    } catch {
      setApiErrorMessage(
        "There was an error submitting your request. Contact tyler@ize.space if you continue to have issues.",
      );
    }
  };

  const { control, handleSubmit } = useForm<FormFields>({
    defaultValues: {
      emailAddress: "",
    },
    resolver: zodResolver(formSchema),
    shouldUnregister: true,
  });

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="link-email-modal"
      aria-describedby="link-email-modal"
    >
      <Box sx={style}>
        <Typography variant="h2" sx={{ mb: "16px" }}>
          Link email address with Ize
        </Typography>
        <form style={{ display: "flex", flexDirection: "column", gap: "12px", width: "100%" }}>
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
                    fullWidth
                    label={"Email address"}
                    required
                    error={Boolean(error)}
                    disabled={success}
                  />
                  <FormHelperText
                    sx={{
                      color: error?.message ? "error.main" : "black",
                    }}
                  >
                    {error?.message ?? apiErrorMessage ?? ""}
                  </FormHelperText>
                </FormControl>
              )}
            />
            <Button onClick={handleSubmit(onSubmit)} variant="contained" disabled={success}>
              Submit
            </Button>
          </Box>
          {success && (
            <Typography>
              Check your email! We&apos;ve sent you a link to authenticate your email address with
              Ize.
            </Typography>
          )}
        </form>
      </Box>
    </Modal>
  );
}
