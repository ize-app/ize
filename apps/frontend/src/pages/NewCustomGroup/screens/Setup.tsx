import { zodResolver } from "@hookform/resolvers/zod";
import { Typography } from "@mui/material";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { WebhookField } from "@/components/Form/formFields/WebhookField/WebhookField";
import { WizardScreenBodyNarrow } from "@/components/Wizard/WizardScreenBodyNarrow";

import { EntitySearch, TextField } from "../../../components/Form/formFields";
import { WizardNav } from "../../../components/Wizard";
import { TelegramBotSetup } from "../components/TelegramBotSetup";
import { GroupInitialSetupSchemaType, groupInitialSetupFormSchema } from "../formValidation";
import { useNewCustomGroupWizardState } from "../newCustomGroupWizard";

export const Setup = () => {
  const { formState, setFormState, onNext, onPrev, nextLabel } = useNewCustomGroupWizardState();

  const formMethods = useForm<GroupInitialSetupSchemaType>({
    defaultValues: {
      name: formState.name ?? "",
      description: formState.description ?? "",
      members: formState.members ?? [],
      notification: formState.notification ?? {},
    },
    resolver: zodResolver(groupInitialSetupFormSchema),
    shouldUnregister: true,
  });

  const onSubmit = (data: GroupInitialSetupSchemaType) => {
    setFormState((prev) => ({
      ...prev,
      ...data,
    }));

    onNext();
  };

  const entity = formMethods.watch("entity");

  useEffect(() => {
    if (entity) {
      formMethods.setValue("members", [entity]);
    }
  }, [entity]);

  return (
    <FormProvider {...formMethods}>
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
            <TelegramBotSetup />
            <Typography variant="description">
              Groups are 100% collaboratively managed organisms. There is no admin, no boss - just
              you and your buddies determining how you want to collaborate together. <br />
              <br />
              To start off, let&apos;s get some basic information about your new group.
            </Typography>
            <TextField<GroupInitialSetupSchemaType>
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
            <TextField<GroupInitialSetupSchemaType>
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
            <EntitySearch<GroupInitialSetupSchemaType>
              ariaLabel={"Individuals and groups to add to custom group"}
              control={formMethods.control}
              name={"members"}
              hideCustomGroups={true}
              label={"Group members *"}
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
    </FormProvider>
  );
};
