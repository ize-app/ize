import { useMutation } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useContext, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { TextField } from "@/components/Form/formFields";
import { UpdateProfileDocument } from "@/graphql/generated/graphql";
import { CurrentUserContext } from "@/hooks/contexts/current_user_context";
import { SnackbarContext } from "@/hooks/contexts/SnackbarContext";

import { UserSettingsSchemaType, userSettingsSchema } from "./formValidation";

export const ProfileForm = () => {
  const { me, refetch } = useContext(CurrentUserContext);
  const { setSnackbarOpen, setSnackbarData } = useContext(SnackbarContext);

  const formMethods = useForm<UserSettingsSchemaType>({
    defaultValues: {
      userName: me?.user.name ?? "",
    },
    resolver: zodResolver(userSettingsSchema),
    shouldUnregister: true,
  });

  const [mutate] = useMutation(UpdateProfileDocument, {
    onCompleted: (_data) => {
      setSnackbarOpen(true);
      setSnackbarData({ message: "Profile updated!", type: "success" });
      if (refetch) {
        refetch();
      }
    },
    onError: (_error) => {
      setSnackbarOpen(true);
      setSnackbarData({ message: "Profile update unsuccessful", type: "error" });
    },
  });

  const onSubmit = async (data: UserSettingsSchemaType) => {
    await mutate({
      variables: {
        profile: {
          name: data.userName,
        },
      },
    });
  };

  useEffect(() => {
    if (me)
      formMethods.reset(
        {
          userName: me.user.name,
        },
        // { keepDirtyValues: true },
      );
  }, [me]);
  return (
    <FormProvider {...formMethods}>
      <form
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          margin: "16px 0px",
          maxWidth: "600px",
        }}
      >
        <TextField<UserSettingsSchemaType>
          name={"userName"}
          label={"Display name"}
          showLabel={true}
        />
        <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "flex-end" }}>
          {formMethods.formState.isDirty && (
            <Button
              variant="contained"
              size="small"
              disabled={!formMethods.formState.isDirty}
              onClick={formMethods.handleSubmit(onSubmit)}
            >
              Save
            </Button>
          )}
        </Box>
      </form>
    </FormProvider>
  );
};
