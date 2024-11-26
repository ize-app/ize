import { zodResolver } from "@hookform/resolvers/zod";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { FormProvider, useForm } from "react-hook-form";

import { EntitiesSearchField } from "@/components/Form/formFields/EntitiesSearchField";
import { FlowsSearchField } from "@/components/Form/formFields/FlowsSearchField";
import { WizardScreenBodyNarrow } from "@/components/Wizard/WizardScreenBodyNarrow";

import { RequestDefinedOptionsForm } from "./RequestDefinedOptionsForm";
import {
  DatePicker,
  DateTimePicker,
  MultiSelect,
  SortableList,
  TextField,
} from "../../../components/Form/formFields";
import { Radio } from "../../../components/Form/formFields/Radio";
import { WizardNav } from "../../../components/Wizard";
import { FieldDataType, FieldType, OptionSelectionType } from "../../../graphql/generated/graphql";
import { RequestSchemaType, requestSchema } from "../formValidation";
import { NewRequestFormSchema, useNewRequestWizardState } from "../newRequestWizard";

export const RequestForm = () => {
  const { formState, setFormState, onPrev, onNext, nextLabel } = useNewRequestWizardState();

  const formMethods = useForm({
    defaultValues: formState.request ?? {},
    resolver: zodResolver(requestSchema),
    shouldUnregister: false,
  });

  // console.log("form state is ", formMethods.getValues());
  // console.log("errors are  ", formMethods.formState.errors);

  const onSubmit = (data: RequestSchemaType) => {
    setFormState((prev): NewRequestFormSchema => {
      return {
        ...prev,
        request: data,
      };
    });
    onNext();
  };

  const flow = formState.flow;
  const step = flow?.steps[0];

  if (!flow || !step) return null;

  return (
    <FormProvider {...formMethods}>
      <form>
        <WizardScreenBodyNarrow>
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
                gap: "30px",
                maxWidth: "800px",
              }}
            >
              <TextField<RequestSchemaType>
                label={"Request name"}
                variant="outlined"
                placeholderText="Describe the intention of this request."
                showLabel={true}
                name={`name`}
                required={true}
                multiline
              />
              {/* <hr style={{ border: "1px solid #ddd", width: "100%", margin: "18px 0px" }} /> */}
              {flow.fieldSet.fields.length > 0 && (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    marginBottom: "24px",
                    padding: "20px",
                    outline: "1px solid rgba(0, 0, 0, 0.1)",
                  }}
                >
                  {flow.fieldSet.fields.map((field) => {
                    switch (field.__typename) {
                      case FieldType.FreeInput: {
                        const { dataType, name, required, fieldId } = field;

                        switch (dataType) {
                          case FieldDataType.Date:
                            return (
                              <DatePicker<RequestSchemaType>
                                name={`requestFields.${field.fieldId}.value`}
                                key={fieldId}
                                required={required}
                                label={name}
                                showLabel={true}
                                seperateLabel={true}
                              />
                            );
                          case FieldDataType.DateTime:
                            return (
                              <DateTimePicker<RequestSchemaType>
                                name={`requestFields.${field.fieldId}.value`}
                                key={fieldId}
                                label={name}
                                required={required}
                                showLabel={true}
                                seperateLabel={true}
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
                                hideIzeGroups={true}
                                label={name}
                                showLabel={true}
                                seperateLabel={true}
                              />
                            );
                          case FieldDataType.FlowIds:
                            return (
                              <FlowsSearchField<RequestSchemaType>
                                name={`requestFields.${field.fieldId}.value`}
                                key={fieldId}
                                ariaLabel={name}
                                label={name}
                                showLabel={true}
                                seperateLabel={true}
                                groupId={flow.group?.id}
                                systemFieldType={field.systemType}
                              />
                            );
                          default:
                            return (
                              <TextField<RequestSchemaType>
                                key={fieldId}
                                label={name}
                                showLabel={true}
                                seperateLabel={true}
                                variant="outlined"
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
                          case OptionSelectionType.Select: {
                            return (
                              <Radio<RequestSchemaType>
                                name={`requestFields.${field.fieldId}.optionSelections[0].optionId`}
                                key={fieldId}
                                label={name}
                                sx={{ flexDirection: "column", gap: "4px" }}
                                options={options.map((option) => ({
                                  label: option.name,
                                  value: option.optionId,
                                  dataType: option.dataType,
                                }))}
                              />
                            );
                          }
                          case OptionSelectionType.MultiSelect: {
                            return (
                              <MultiSelect<RequestSchemaType>
                                name={`requestFields.${field.fieldId}.optionSelections`}
                                label={name}
                                key={fieldId}
                                sx={{ flexDirection: "column", gap: "4px" }}
                                options={options.map((option) => ({
                                  label: option.name,
                                  value: option.optionId,
                                  dataType: option.dataType,
                                }))}
                              />
                            );
                          }
                          case OptionSelectionType.Rank: {
                            return (
                              <SortableList<RequestSchemaType>
                                label={name}
                                key={fieldId}
                                formMethods={formMethods}
                                name={`requestFields.${field.fieldId}.optionSelections`}
                                options={options.map((option) => ({
                                  label: option.name,
                                  value: option.optionId,
                                  dataType: option.dataType,
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
              )}
              <RequestDefinedOptionsForm flow={flow} />
            </Box>
          </Box>
        </WizardScreenBodyNarrow>
        <WizardNav
          onNext={formMethods.handleSubmit(onSubmit)}
          onPrev={onPrev}
          nextLabel={nextLabel}
        />
      </form>
    </FormProvider>
  );
};
