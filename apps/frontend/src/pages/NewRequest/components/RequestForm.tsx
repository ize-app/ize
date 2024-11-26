import { zodResolver } from "@hookform/resolvers/zod";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { FormProvider, useForm } from "react-hook-form";

import { InputField } from "@/components/Form/formFields/InputField";
import { WizardScreenBodyNarrow } from "@/components/Wizard/WizardScreenBodyNarrow";

import { RequestDefinedOptionsForm } from "./RequestDefinedOptionsForm";
import { TextField } from "../../../components/Form/formFields";
import { WizardNav } from "../../../components/Wizard";
import { FieldType } from "../../../graphql/generated/graphql";
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
                    if (field.__typename === FieldType.FreeInput) {
                      return (
                        <InputField
                          fieldName={`requestFields.${field.fieldId}`}
                          label={field.name}
                          dataType={field.dataType}
                          key={field.fieldId}
                          type={FieldType.FreeInput}
                        />
                      );
                    } else if (field.__typename === FieldType.Options) {
                      return (
                        <InputField<RequestSchemaType>
                          fieldName={`requestFields.${field.fieldId}`}
                          label={field.name}
                          key={field.fieldId}
                          type={FieldType.Options}
                          options={field.options.map((o) => ({
                            label: o.name,
                            value: o.optionId,
                            dataType: o.dataType,
                          }))}
                          selectionType={field.selectionType}
                        />
                      );
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
