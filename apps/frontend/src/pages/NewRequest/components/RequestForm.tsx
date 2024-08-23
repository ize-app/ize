import { zodResolver } from "@hookform/resolvers/zod";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useForm } from "react-hook-form";

import { EntitiesSearchField } from "@/components/Form/formFields/EntitiesSearchField";
import { FlowsSearchField } from "@/components/Form/formFields/FlowsSearchField";
import { WebhookField } from "@/components/Form/formFields/WebhookField/WebhookField";
import { WizardScreenBodyNarrow } from "@/components/Wizard/WizardScreenBodyNarrow";

import {
  DatePicker,
  DateTimePicker,
  MultiSelect,
  SortableList,
  TextField,
} from "../../../components/Form/formFields";
import { Radio } from "../../../components/Form/formFields/Radio";
import { WizardNav } from "../../../components/Wizard";
import {
  FieldDataType,
  FieldOptionsSelectionType,
  FieldType,
} from "../../../graphql/generated/graphql";
import { CreateRequestResponseFieldForm } from "../components/CreateRequestResponseFieldForm";
import { RequestSchemaType, requestSchema } from "../formValidation";
import { useNewRequestWizardState } from "../newRequestWizard";

export const RequestForm = () => {
  const { formState, setFormState, onPrev, onNext, nextLabel } = useNewRequestWizardState();


  const formMethods = useForm({
    defaultValues: formState ?? {},
    resolver: zodResolver(requestSchema),
    shouldUnregister: true,
  });

  // console.log("form state is ", formMethods.getValues());
  // console.log("errors are  ", formMethods.formState.errors);

  const onSubmit = (data: RequestSchemaType) => {
    setFormState((prev) => ({
      ...prev,
      name: data.name,
      requestFields: data.requestFields ?? undefined,
      requestDefinedOptions: data.requestDefinedOptions ?? [],
    }));
    onNext();
  };

  const flow = formState.flow;
  const step = flow?.steps[0];

  if (!flow || !step) return null;

  // console.log("form errors are ", formMethods.formState.errors);
  // console.log("form state is ", formMethods.getValues());
  return (
    <>
      <WizardScreenBodyNarrow>
        {/* <div>Create a new request for {formState.process?.name}</div> */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            marginBottom: "24px",
          }}
        >
          <Typography fontWeight={600} color="primary" marginBottom={"12px"}>
            Flow: {flow.name}
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              maxWidth: "800px",
            }}
          >
            <TextField<RequestSchemaType>
              label={"Request name"}
              variant="outlined"
              placeholderText="Describe the intention of this request."
              showLabel={true}
              control={formMethods.control}
              name={`name`}
              required={true}
              multiline
            />
            {step?.request.fields.map((field) => {
              switch (field.__typename) {
                case FieldType.FreeInput: {
                  const { dataType, name, required, fieldId } = field;

                  switch (dataType) {
                    case FieldDataType.Date:
                      return (
                        <DatePicker<RequestSchemaType>
                          name={`requestFields.${field.fieldId}.value`}
                          key={fieldId}
                          control={formMethods.control}
                          // showLabel={false}
                          required={required}
                          label={name}
                        />
                      );
                    case FieldDataType.DateTime:
                      return (
                        <DateTimePicker<RequestSchemaType>
                          name={`requestFields.${field.fieldId}.value`}
                          key={fieldId}
                          control={formMethods.control}
                          // showLabel={false}
                          label={name}
                          required={required}
                        />
                      );
                    case FieldDataType.FlowVersionId:
                      throw Error("Flow version Id cannot be directly editted");
                    case FieldDataType.EntityIds:
                      return (
                        <EntitiesSearchField<RequestSchemaType>
                          name={`requestFields.${field.fieldId}.value`}
                          key={fieldId}
                          ariaLabel={name}
                          hideCustomGroups={true}
                          setFieldValue={formMethods.setValue}
                          getFieldValues={formMethods.getValues}
                          control={formMethods.control}
                          label={name}
                        />
                      );
                    case FieldDataType.FlowIds:
                      return (
                        <FlowsSearchField<RequestSchemaType>
                          name={`requestFields.${field.fieldId}.value`}
                          key={fieldId}
                          ariaLabel={name}
                          control={formMethods.control}
                          label={name}
                        />
                      );
                    case FieldDataType.Webhook:
                      return (
                        <WebhookField
                          formMethods={formMethods}
                          type="notification"
                          name={`requestFields.${field.fieldId}.value`}
                          key={fieldId}
                          control={formMethods.control}
                          required={required}
                        />
                      );
                    default:
                      return (
                        <TextField<RequestSchemaType>
                          key={fieldId}
                          label={name}
                          variant="outlined"
                          showLabel={true}
                          control={formMethods.control}
                          name={`requestFields.${field.fieldId}.value`}
                          required={required}
                          multiline
                        />
                      );
                  }
                }
                case FieldType.Options: {
                  const { options, name, selectionType, fieldId } = field;

                  switch (selectionType) {
                    case FieldOptionsSelectionType.Select: {
                      return (
                        <Radio<RequestSchemaType>
                          name={`requestFields.${field.fieldId}.optionSelections[0].optionId`}
                          key={fieldId}
                          control={formMethods.control}
                          label={name}
                          sx={{ flexDirection: "column", gap: "4px" }}
                          options={options.map((option) => ({
                            label: option.name,
                            value: option.optionId,
                          }))}
                        />
                      );
                    }
                    case FieldOptionsSelectionType.MultiSelect: {
                      return (
                        <MultiSelect<RequestSchemaType>
                          name={`requestFields.${field.fieldId}.optionSelections`}
                          control={formMethods.control}
                          label={name}
                          key={fieldId}
                          sx={{ flexDirection: "column", gap: "4px" }}
                          options={options.map((option) => ({
                            label: option.name,
                            value: option.optionId,
                          }))}
                        />
                      );
                    }
                    case FieldOptionsSelectionType.Rank: {
                      return (
                        <SortableList<RequestSchemaType>
                          control={formMethods.control}
                          label={name}
                          key={fieldId}
                          formMethods={formMethods}
                          name={`requestFields.${field.fieldId}.optionSelections`}
                          options={options.map((option) => ({
                            label: option.name,
                            value: option.optionId,
                          }))}
                        />
                      );
                    }
                  }
                  break;
                }
                default:
                  throw Error("Invalid field type");
              }
            })}
          </Box>
          <Typography fontStyle={"italic"}>How respondants will be able to respond:</Typography>
          <CreateRequestResponseFieldForm
            field={step?.response.fields[0]}
            formMethods={formMethods}
          />
        </Box>
      </WizardScreenBodyNarrow>
      <WizardNav
        onNext={formMethods.handleSubmit(onSubmit)}
        onPrev={onPrev}
        nextLabel={nextLabel}
      />
    </>
  );
};
