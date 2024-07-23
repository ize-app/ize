import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { WizardScreenBodyNarrow } from "@/components/Wizard/WizardScreenBodyNarrow";

import { RoleSearch, TextField } from "../../../components/Form/formFields";
import { WizardNav } from "../../../components/Wizard";
import { NewCustomGroupSchemaType, newCustomGroupFormSchema } from "../formValidation";
import { useNewCustomGroupWizardState } from "../newCustomGroupWizard";

export const Setup = () => {
  const { formState, setFormState, onNext, onPrev, nextLabel } = useNewCustomGroupWizardState();

  const {
    control,
    handleSubmit,
    setValue: setFieldValue,
    getValues: getFieldValues,
  } = useForm<NewCustomGroupSchemaType>({
    defaultValues: {
      name: formState.name ?? "",
      description: formState.description ?? "",
      members: formState.members ?? [],
    },
    resolver: zodResolver(newCustomGroupFormSchema),
    shouldUnregister: true,
  });

  const onSubmit = (data: NewCustomGroupSchemaType) => {
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
            gap: "12px",
          }}
        >
          <TextField<NewCustomGroupSchemaType>
            name="name"
            control={control}
            size="small"
            label="Group name"
            placeholderText="Group name"
            defaultValue={""}
            required
            showLabel={true}
            variant="outlined"
          />
          <TextField<NewCustomGroupSchemaType>
            name="description"
            control={control}
            size="small"
            label="Description"
            showLabel={true}
            rows={2}
            multiline
            placeholderText="What's the purpose of this group?"
            defaultValue={""}
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
