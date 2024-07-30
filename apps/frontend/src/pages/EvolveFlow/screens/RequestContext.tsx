import { zodResolver } from "@hookform/resolvers/zod";
import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { useForm } from "react-hook-form";

import { WizardScreenBodyNarrow } from "@/components/Wizard/WizardScreenBodyNarrow";

import { TextField } from "../../../components/Form/formFields";
import { WizardNav } from "../../../components/Wizard";
import { useEvolveFlowWizardState } from "../evolveFlowWizard";
import { EvolveRequestContextSchemaType, evolveRequestContextSchema } from "../formValidation";

export const RequestContext = () => {
  const { formState, setFormState, onPrev, onNext, nextLabel } = useEvolveFlowWizardState();

  const formMethods = useForm({
    defaultValues: formState.requestName ? { requestName: formState.requestName } : {},
    resolver: zodResolver(evolveRequestContextSchema),
    shouldUnregister: true,
  });

  const onSubmit = (data: EvolveRequestContextSchemaType) => {
    setFormState((prev) => ({
      ...prev,
      requestName: data.requestName ?? "",
      requestDescription: data.requestDescription,
    }));
    onNext();
  };

  return (
    <>
      <WizardScreenBodyNarrow>
        {/* <div>Create a new request for {formState.process?.name}</div> */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            maxWidth: "800px",
            marginTop: "24px",
          }}
        >
          <Typography fontWeight={600} color="primary" marginBottom={"12px"}>
            {formState.name}
          </Typography>
          <TextField<EvolveRequestContextSchemaType>
            label={"Evolution summary"}
            variant="outlined"
            placeholderText="Summarize this evolution request"
            showLabel={true}
            //@ts-expect-error TODO: not sure why this is giving ts error
            control={formMethods.control}
            name={`requestName`}
            defaultValue=""
            required={true}
            multiline
          />
          <TextField<EvolveRequestContextSchemaType>
            label={"Additional details"}
            variant="outlined"
            placeholderText="Give additional context on why this change is being requested"
            showLabel={true}
            //@ts-expect-error TODO: not sure why this is giving ts error
            control={formMethods.control}
            name={`requestDescription`}
            defaultValue=""
            required={false}
            multiline
          />
        </Box>
      </WizardScreenBodyNarrow>
      <WizardNav
        //@ts-expect-error TODO: not sure why this is giving ts error
        onNext={formMethods.handleSubmit(onSubmit)}
        onPrev={onPrev}
        nextLabel={nextLabel}
      />
    </>
  );
};
