import { zodResolver } from "@hookform/resolvers/zod";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { FormProvider, Path, useForm } from "react-hook-form";

import { InputFieldAnswers } from "@/components/Form/InputField/InputFieldAnswers";
import { WizardScreenBodyNarrow } from "@/components/Wizard/WizardScreenBodyNarrow";

import { RequestDefinedOptionsForm } from "./RequestDefinedOptionsForm";
import { TextField } from "../../../components/Form/formFields";
import { WizardNav } from "../../../components/Wizard";
import { NewRequestFormSchema, useNewRequestWizardState } from "../newRequestWizard";
import { RequestSchemaType, requestSchema } from "../requestValidation";

export const RequestForm = () => {
  const { formState, setFormState, onPrev, onNext, nextLabel } = useNewRequestWizardState();

  const formMethods = useForm({
    defaultValues: formState.request ?? {},
    resolver: zodResolver(requestSchema),
    shouldUnregister: false,
  });

  console.log("form state is ", formMethods.getValues());
  console.log("errors are  ", formMethods.formState.errors);

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
              <InputFieldAnswers<RequestSchemaType>
                fields={flow.fieldSet.fields}
                basePath={`requestFields` as Path<RequestSchemaType>}
                groupId={flow.group?.id}
              />
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
