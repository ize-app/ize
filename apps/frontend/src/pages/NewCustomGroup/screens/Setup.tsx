import { zodResolver } from "@hookform/resolvers/zod";
import { Typography } from "@mui/material";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";

import telegramLogoUrl from "@/assets/telegram-logo.svg";
import { FieldBlockFadeIn } from "@/components/Form/formLayout/FieldBlockFadeIn";

import { ButtonGroupField, EntitySearch, TextField } from "../../../components/Form/formFields";
import { WizardNav } from "../../../components/Wizard";
import { TelegramBotSetup } from "../components/TelegramBotSetup";
import { GroupInitialSetupSchemaType, groupInitialSetupFormSchema } from "../formValidation";
import { useNewCustomGroupWizardState } from "../newCustomGroupWizard";
import { GroupCommunicationType } from "../types";

export const Setup = () => {
  const { formState, setFormState, onNext, onPrev, nextLabel } = useNewCustomGroupWizardState();

  const formMethods = useForm<GroupInitialSetupSchemaType>({
    defaultValues: {
      name: formState.name ?? "",
      description: formState.description ?? "",
      members: formState.members ?? [],
      notificationEntity: undefined,
    },
    resolver: zodResolver(groupInitialSetupFormSchema),
    shouldUnregister: false,
  });

  // console.log("form state", formMethods.getValues());

  const onSubmit = (data: GroupInitialSetupSchemaType) => {
    setFormState((prev) => ({
      ...prev,
      ...data,
    }));

    onNext();
  };

  const groupCommunicationChannel = formMethods.watch("groupCommunicationChannel");
  const entity = formMethods.watch("notificationEntity");
  const members = formMethods.watch("members") ?? [];

  useEffect(() => {
    if (entity) {
      console.log("about to set entity");
      formMethods.setValue("members", [entity]);
      formMethods.setValue("name", entity.name);
    }
  }, [entity]);

  return (
    <FormProvider {...formMethods}>
      <>
        {/* <WizardScreenBodyNarrow> */}
        <form
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "30px",
          }}
        >
          <FieldBlockFadeIn>
            <Typography variant="body1">How does your team communicate?</Typography>
            <Typography variant="description">
              This is where Ize will send notifications for shared collabroative process
            </Typography>
            <ButtonGroupField<GroupInitialSetupSchemaType>
              name={"groupCommunicationChannel"}
              label="label"
              options={[
                {
                  value: GroupCommunicationType.Telegram,
                  name: "Telegram",
                  icon: telegramLogoUrl,
                },
                { value: GroupCommunicationType.Other, name: "Other" },
              ]}
            />
          </FieldBlockFadeIn>
          {groupCommunicationChannel === GroupCommunicationType.Telegram && (
            <FieldBlockFadeIn>
              <TelegramBotSetup />
            </FieldBlockFadeIn>
          )}
          {(groupCommunicationChannel === GroupCommunicationType.Other || !!entity) && (
            <FieldBlockFadeIn>
              <Typography variant="body1">Who is part of your group?</Typography>
              <Typography variant="description">
                When this group has permissions on a collaborative process, your members will be
                able to participate
              </Typography>
              <EntitySearch<GroupInitialSetupSchemaType>
                ariaLabel={"Individuals and groups to add to custom group"}
                control={formMethods.control}
                name={"members"}
                hideCustomGroups={true}
                label={"Group members *"}
                setFieldValue={formMethods.setValue}
                getFieldValues={formMethods.getValues}
                showLabel={false}
              />
            </FieldBlockFadeIn>
          )}

          {/* <WebhookField formMethods={formMethods} name={"notification"} type={"notification"} /> */}
          {members.length > 0 && (
            <FieldBlockFadeIn>
              <Typography variant="body1">What should we call your group?</Typography>
              <TextField<GroupInitialSetupSchemaType>
                name="name"
                size="small"
                label="Group name"
                placeholderText="Group name"
                defaultValue={""}
                required
                showLabel={false}
                variant="outlined"
              />
              {/* <TextField<GroupInitialSetupSchemaType>
                  name="description"
                  control={formMethods.control}
                  size="small"
                  label="Description"
                  showLabel={false}
                  rows={2}
                  multiline
                  placeholderText="What's the purpose of this group?"
                  defaultValue={""}
                /> */}
            </FieldBlockFadeIn>
          )}
        </form>
        {/* </WizardScreenBodyNarrow> */}
        <WizardNav
          onNext={formMethods.handleSubmit(onSubmit)}
          onPrev={onPrev}
          nextLabel={nextLabel}
        />
      </>
    </FormProvider>
  );
};
