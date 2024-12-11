import { useMutation } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, FormLabel, Typography } from "@mui/material";
import { useContext, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { Switch, TextField } from "@/components/Form/formFields";
import { WizardBody, WizardNav } from "@/components/Wizard";
import { UpdateProfileDocument } from "@/graphql/generated/graphql";
import { CurrentUserContext } from "@/hooks/contexts/current_user_context";
import { SnackbarContext } from "@/hooks/contexts/SnackbarContext";
import { UserSettingsSchemaType, userSettingsSchema } from "@/pages/Settings/formValidation";
import { UserIdentities } from "@/pages/Settings/UserIdentities";

import { useNewUserWizardState } from "../newUserWizardSetup";

export const Setup = () => {
  const { me, refetch } = useContext(CurrentUserContext);
  const { setSnackbarOpen, setSnackbarData } = useContext(SnackbarContext);
  const formMethods = useForm<UserSettingsSchemaType>({
    defaultValues: {
      userName: me?.user.name ?? "",
      notifications: {
        transactional: me?.notifications?.transactional ?? true,
        marketing: me?.notifications?.marketing ?? false,
      },
    },
    resolver: zodResolver(userSettingsSchema),
    shouldUnregister: false,
  });
  const [mutate] = useMutation(UpdateProfileDocument, {
    onError: (_error) => {
      setSnackbarOpen(true);
      setSnackbarData({ message: "Something went wrong", type: "error" });
    },
  });
  const { onPrev, nextLabel, disableNext, onNext } = useNewUserWizardState();

  const onSubmit = async (data: UserSettingsSchemaType) => {
    await mutate({
      variables: {
        profile: {
          name: data.userName,
          notifications: {
            transactional: data.notifications.transactional,
            marketing: data.notifications.marketing,
          },
        },
      },
    });
    if (refetch) {
      refetch();
    }
    onNext();
  };

  useEffect(() => {
    if (me)
      formMethods.reset(
        {
          userName: me.user.name,
          notifications: {
            transactional: me.notifications?.transactional ?? true,
            marketing: me.notifications?.marketing ?? false,
          },
        },
        // { keepDirtyValues: true },
      );
  }, [me]);

  return (
    <FormProvider {...formMethods}>
      <form>
        <WizardBody>
          <Box sx={{ display: "flex", flexDirection: "column", gap: "30px", maxWidth: "800px" }}>
            <TextField
              seperateLabel={true}
              showLabel={true}
              // displayLabel={true}
              name={"userName"}
              label={"What should we call you?"}
              required
              size="small"
            />
            <Box sx={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <FormLabel>What kind of email notifications would you like to receive?</FormLabel>
              <Switch
                name={"notifications.transactional"}
                label={"Weekly digest on flows you're watching"}
              />
              <Switch
                name={"notifications.marketing"}
                label={"Quarterly product and ecosystem updates"}
              />
            </Box>
            <Box>
              <FormLabel>Would you like to connect additional accounts to Ize?</FormLabel>
              <Typography variant="body2" color={"secondary"}>
                This will allow you to participate in flows that span across identitites.
                <br />
                You can also set this up later.
              </Typography>
              <Box sx={{ marginTop: "12px" }}>
                <UserIdentities />
              </Box>
            </Box>
          </Box>
        </WizardBody>

        <WizardNav
          nextLabel={nextLabel}
          onPrev={onPrev}
          onNext={formMethods.handleSubmit(onSubmit)}
          disableNext={disableNext}
        />
      </form>
    </FormProvider>
  );
};
