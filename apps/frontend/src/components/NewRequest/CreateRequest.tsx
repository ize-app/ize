import { zodResolver } from "@hookform/resolvers/zod";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import z, { ZodTypeAny } from "zod";

import { useNewRequestWizardState } from "./newRequestWizard";
import { zodCleanNumber, zodCleanString } from "../../utils/inputs";
import { ProcessInputType } from "../NewProcess/newProcessWizard";
import { TextFieldControl } from "../shared/Form";
import { ProcessOptions } from "../shared/Process/ProcessOptions";
import { processMockData } from "../shared/Tables/mockData";
import { WizardBody, WizardNav } from "../shared/Wizard";

const createInputValidation = (type: ProcessInputType, isRequired: boolean) => {
  let val: ZodTypeAny;
  switch (type) {
    case ProcessInputType.Number:
      val = zodCleanNumber(
        isRequired
          ? z.number({ invalid_type_error: "Please enter a valid number" })
          : z
              .number({ invalid_type_error: "Please enter a valid number" })
              .optional(),
      );
      break;
    case ProcessInputType.Text:
      val = zodCleanString(
        isRequired ? z.string().nonempty() : z.string().optional(),
      );
      break;
  }
  return val;
};

export const CreateRequest = () => {
  const { formState, setFormState, onPrev, nextLabel } =
    useNewRequestWizardState();
  const { processId } = useParams();
  const navigate = useNavigate();

  const formSchema = z.object(
    formState.process
      ? formState.process.inputs.reduce(
          (acc, input) => ({
            ...acc,
            [input.inputId]: createInputValidation(input.type, input.required),
          }),
          {},
        )
      : {},
  );

  type FormFields = z.infer<typeof formSchema>;

  const { control, handleSubmit } = useForm({
    defaultValues: formState.process
      ? formState.process.inputs.reduce(
          (acc, input) => ({ ...acc, [input.inputId]: "" }),
          {},
        )
      : {},
    resolver: zodResolver(formSchema),
    shouldUnregister: true,
  });

  const onSubmit = (data: FormFields) => {
    setFormState((prev) => ({
      ...prev,
      userInputs: data,
    }));
    // onNext({ processId });
    navigate("confirm");
  };

  useEffect(() => {
    const process = processMockData.find(
      (process) => process.processId === processId,
    );
    setFormState({ process });
  }, [processId, setFormState]);

  return (
    <>
      <WizardBody>
        {/* <div>Create a new request for {formState.process?.name}</div> */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            marginBottom: "24px",
          }}
        >
          <Typography variant="body1">
            Your request will have the following options:
          </Typography>
          <ProcessOptions
            options={formState.process ? formState.process?.options : []}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            maxWidth: "800px",
          }}
        >
          {control
            ? formState.process?.inputs.map((input) => (
                <TextFieldControl
                  key={input.inputId}
                  label={input.name}
                  control={control}
                  name={input.inputId}
                  required={input.required}
                  placeholder={input.description}
                />
              ))
            : null}
        </Box>
      </WizardBody>
      <WizardNav
        onNext={handleSubmit(onSubmit)}
        onPrev={onPrev}
        nextLabel={nextLabel}
      />
    </>
  );
};
