import { Controller, useForm } from "react-hook-form";
import { WizardNav } from "../../../components/Wizard";
import { useNewCustomGroupWizardState, NewCustomGroupFormFields } from "../newCustomGroupWizard";
import { newCustomGroupFormSchema } from "../formValidation";
import { zodResolver } from "@hookform/resolvers/zod";
import { RoleSearch } from "../../../components/Form/formFields";
import { FormControl, FormHelperText, TextField } from "@mui/material";
import { WizardScreenBodyNarrow } from "@/components/Wizard/WizardScreenBodyNarrow";

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
      <WizardScreenBodyNarrow>
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
          <RoleSearch
            ariaLabel={"Individuals and groups to add to custom group"}
            control={control}
            name={"members"}
            label={"Group members"}
            setFieldValue={setFieldValue}
            getFieldValues={getFieldValues}
          />
        </form>
      </WizardScreenBodyNarrow>
      <WizardNav onNext={handleSubmit(onSubmit)} onPrev={onPrev} nextLabel={nextLabel} />
    </>
  );
};
