import { zodResolver } from "@hookform/resolvers/zod";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { TextField } from "@/components/Form/formFields";
import { MePartsFragment } from "@/graphql/generated/graphql";

import { UserSettingsSchemaType, userSettingsSchema } from "./formValidation";

export const ProfileForm = ({ me }: { me: MePartsFragment }) => {
  const { control, reset, formState } = useForm<UserSettingsSchemaType>({
    defaultValues: {
      userName: me.user.name,
    },
    resolver: zodResolver(userSettingsSchema),
    shouldUnregister: true,
  });

  useEffect(() => {
    if (me)
      reset(
        {
          userName: me.user.name,
        },
        { keepDirtyValues: true },
      );
  }, [me]);
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        margin: "16px 0px",
        maxWidth: "600px",
      }}
    >
      <TextField<UserSettingsSchemaType>
        name={"userName"}
        control={control}
        label={"Display name"}
        showLabel={true}
      />
      <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "flex-end" }}>
        {formState.isDirty && (
          <Button variant="contained" size="small" disabled={!formState.isDirty}>
            Save
          </Button>
        )}
      </Box>
    </Box>
  );
};
