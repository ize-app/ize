import { zodResolver } from "@hookform/resolvers/zod";
import { Box } from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { WebhookTestButton } from "@/components/Form/formFields/WebhookTestButton";
import { WizardScreenBodyNarrow } from "@/components/Wizard/WizardScreenBodyNarrow";
import { Status } from "@/graphql/generated/graphql";

import { EntitySearch, TextField } from "../../../components/Form/formFields";
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

  const [testWebhookStatus, setTestWebhookStatus] = useState<Status | null>(null);

  const handleTestWebhook = async (_event: React.MouseEvent<HTMLElement>) => {
    setTestWebhookStatus(Status.InProgress);
    try {
      // const res = await testWebhook({
      //   variables: {
      //     inputs: createTestWebhookArgs(formMethods.getValues(), uri),
      //   },
      // });
      // const success = res.data?.testWebhook ?? false;
      const success = true;
      setTestWebhookStatus(success ? Status.Completed : Status.Failure);
    } catch (e) {
      console.log("Test webhook error: ", e);
    }
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
          <EntitySearch<NewCustomGroupSchemaType>
            ariaLabel={"Individuals and groups to add to custom group"}
            control={control}
            name={"members"}
            hideCustomGroups={true}
            label={"Group members"}
            setFieldValue={setFieldValue}
            getFieldValues={getFieldValues}
          />
          <Box sx={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <TextField<NewCustomGroupSchemaType>
              control={control}
              label="Url"
              size="small"
              showLabel={false}
              placeholderText="Webhook Uri for sending notifications"
              name={`notification.uri`}
            />
            <WebhookTestButton
              testWebhookStatus={testWebhookStatus}
              handleTestWebhook={handleTestWebhook}
            />
          </Box>
        </form>
      </WizardScreenBodyNarrow>
      <WizardNav onNext={handleSubmit(onSubmit)} onPrev={onPrev} nextLabel={nextLabel} />
    </>
  );
};
