import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { WebhookField } from "@/components/Form/formFields/WebhookField/WebhookField";
import { WizardScreenBodyNarrow } from "@/components/Wizard/WizardScreenBodyNarrow";

import { EntitySearch, TextField } from "../../../components/Form/formFields";
import { WizardNav } from "../../../components/Wizard";
import { NewCustomGroupSchemaType, newCustomGroupFormSchema } from "../formValidation";
import { useNewCustomGroupWizardState } from "../newCustomGroupWizard";

export const Setup = () => {
  const { formState, setFormState, onNext, onPrev, nextLabel } = useNewCustomGroupWizardState();

  const formMethods = useForm<NewCustomGroupSchemaType>({
    defaultValues: {
      name: formState.name ?? "",
      description: formState.description ?? "",
      members: formState.members ?? [],
      notification: formState.notification ?? {},
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
            control={formMethods.control}
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
            control={formMethods.control}
            size="small"
            label="Description"
            showLabel={true}
            rows={2}
            multiline
            placeholderText="What's the purpose of this group?"
            defaultValue={""}
          />
          <EntitySearch<NewCustomGroupSchemaType>
            ariaLabel={"Individuals and groups to add to custom group"}
            control={formMethods.control}
            name={"members"}
            hideCustomGroups={true}
            label={"Group members"}
            setFieldValue={formMethods.setValue}
            getFieldValues={formMethods.getValues}
          />
          <WebhookField formMethods={formMethods} name={"notification"} type={"notification"} />
        </form>
      </WizardScreenBodyNarrow>
      <WizardNav
        onNext={formMethods.handleSubmit(onSubmit)}
        onPrev={onPrev}
        nextLabel={nextLabel}
      />
    </>
  );
};
