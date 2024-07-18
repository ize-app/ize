import { useMutation } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Cookies from "js-cookie";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { CurrentUserContext } from "@/contexts/current_user_context";
import { UpdateProfileDocument } from "@/graphql/generated/graphql";
import { UserSettingsSchemaType, userSettingsSchema } from "@/pages/Settings/formValidation";
import { colors } from "@/style/style";

import { TextField } from "./Form/formFields";

const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  minWidth: "400px",
  maxWidth: "800px",
  bgcolor: "background.paper",
  border: `2px solid ${colors.primaryContainer}`,
  boxShadow: 24,
  p: 4,
};

export function UserSetupModal() {
  const { me, refetch } = useContext(CurrentUserContext);

  const [open, setOpen] = useState(false);

  const { control, reset, handleSubmit } = useForm<UserSettingsSchemaType>({
    defaultValues: {
      userName: me?.user.name ?? "",
    },
    resolver: zodResolver(userSettingsSchema),
    shouldUnregister: true,
  });

  useEffect(() => {
    Cookies.get("new_user") === "true" && !!me?.user && setOpen(true);
  }, [me]);

  useEffect(() => {
    if (me)
      reset(
        {
          userName: me.user.name,
        },
        // { keepDirtyValues: true },
      );
  }, [me]);

  const [mutate] = useMutation(UpdateProfileDocument, {
    onCompleted: (_data) => {
      if (refetch) {
        refetch();
      }
    },
    // onError: (_error) => {
    // },
  });

  const handleClose = () => {
    setOpen(false);
  };

  const onSubmit = async (data: UserSettingsSchemaType) => {
    Cookies.remove("new_user");
    await mutate({
      variables: {
        profile: {
          name: data.userName,
        },
      },
    });
    handleClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="user-setup-modal"
      aria-describedby="user-setup-modal"
    >
      <Box sx={style}>
        <Typography variant="h2" sx={{ mb: "16px" }}>
          Welcome
        </Typography>
        <Typography variant="body2" sx={{ mb: "16px" }}>
          Ize allows you to connect multiple tools and online identities into a single collaborative
          workflow.{" "}
          <a href={"/about"} target="_blank" rel="noopener noreferrer">
            Learn more
          </a>
          .<br />
          <br />
          You&apos;ve connected <strong>{me?.identities[0]?.name ?? "one identity"}</strong> but you
          can connect more identities (e.g. Discord, blockchain, email, etc){" "}
          <a href={"/identities"} target="_blank" rel="noopener noreferrer">
            here
          </a>
          .
          <br />
          <br />
          What should we call you?
        </Typography>
        <form style={{ display: "flex", flexDirection: "column", gap: "12px", width: "100%" }}>
          <TextField name={"userName"} control={control} label={"Name"} required size="small" />

          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            {" "}
            <Button onClick={handleSubmit(onSubmit)} variant="contained">
              Get started
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
}
