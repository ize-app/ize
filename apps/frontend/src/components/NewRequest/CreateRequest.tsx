import { Box } from "@mui/material";

import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z, { ZodTypeAny } from "zod";

import { zodCleanNumber, zodCleanString } from "../../utils/inputs";
import { ProcessInputType } from "../NewProcess/newProcessWizard";
import { WizardBody, WizardNav } from "../Shared/Wizard";
import { processMockData } from "../shared/Tables/mockData";
import { useNewRequestWizardState } from "./newRequestWizard";
import { TextFieldControl } from "../shared/Form";

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
  const { formState, setFormState, onNext, onPrev, nextLabel } =
    useNewRequestWizardState();
  const { processId } = useParams();

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
    console.log("data is ", data);
    // setFormState((prev) => ({
    //   ...prev,
    // }));
    onNext();
  };

  useEffect(() => {
    console.log("running use Effect");
    const process = processMockData.find(
      (process) => process.processId === processId,
    );
    setFormState({ process });
  }, [processId, setFormState]);

  return (
    <>
      <WizardBody>
        {/* <div>Create a new request for {formState.process?.name}</div> */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: "12px" }}>
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
