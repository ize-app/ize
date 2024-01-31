import { Controller, useForm } from "react-hook-form";
import { WizardBody, WizardNav } from "../shared/Wizard";
import { useNewCustomGroupWizardState, NewCustomGroupFormFields } from "./newCustomGroupWizard";
import { newCustomGroupFormSchema } from "../shared/Form/ProcessForm/formSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { RoleSearchControl } from "../shared/Form";
import { FormControl, FormHelperText, TextField } from "@mui/material";

export const Setup = ({}) => {
  const { formState, setFormState, onNext, onPrev, nextLabel } = useNewCustomGroupWizardState();

  const {
    control,
    handleSubmit,
    setValue: setFieldValue,
    getValues: getFieldValues,
  } = useForm<NewCustomGroupFormFields>({
    defaultValues: {
      name: formState.name ?? [],
      members: formState.members ?? [],
    },
    resolver: zodResolver(newCustomGroupFormSchema),
    shouldUnregister: true,
  });

  const onSubmit = (data: NewCustomGroupFormFields) => {
    setFormState((prev) => ({
      ...prev,
      ...data,
    }));

    onNext();
  };
  return (
    <>
      <WizardBody>
        <form
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <Controller
            name={"name"}
            control={control}
            render={({ field, fieldState: { error } }) => (
              <FormControl>
                <TextField {...field} label={"Group name"} required error={Boolean(error)} />
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
          <RoleSearchControl
            //@ts-ignore
            control={control}
            name={"members"}
            label={"Group members"}
            setFieldValue={setFieldValue}
            // TODO make this typing dynamic
            //@ts-ignore
            getFieldValues={getFieldValues}
          />
        </form>
      </WizardBody>
      <WizardNav onNext={handleSubmit(onSubmit)} onPrev={onPrev} nextLabel={nextLabel} />
    </>
  );
};
