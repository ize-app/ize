import { useQuery } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import * as z from "zod";

import { useNewRequestWizardState } from "./newRequestWizard";
import {
  InputDataType,
  ProcessDocument,
  ProcessSummaryPartsFragment,
} from "../../graphql/generated/graphql";
import * as Routes from "../../routers/routes";
import {
  shortUUIDToFull,
  zodCleanNumber,
  zodCleanString,
} from "../../utils/inputs";
import { TextFieldControl } from "../shared/Form";
import Loading from "../shared/Loading";
import { ProcessOptions } from "../shared/Process/ProcessOptions";
import { WizardBody, WizardNav } from "../shared/Wizard";

const createInputValidation = (type: InputDataType, isRequired: boolean) => {
  let val: z.ZodTypeAny = z.any();
  switch (type) {
    case InputDataType.Float:
      val = zodCleanNumber(
        isRequired
          ? z.number({ invalid_type_error: "Please enter a valid number" })
          : z
              .number({ invalid_type_error: "Please enter a valid number" })
              .optional(),
      );
      break;
    case InputDataType.Text:
      val = zodCleanString(
        isRequired ? z.string().nonempty() : z.string().optional(),
      );
      break;
    default:
      val = z.any();
  }
  return val;
};

export const CreateRequest = () => {
  const { formState, setFormState, onPrev, onNext, nextLabel, setParams } =
    useNewRequestWizardState();
  const { processId: shortProcessId } = useParams();

  useEffect(
    () => setParams({ processId: shortProcessId }),
    [shortProcessId, setParams],
  );

  const processId = shortUUIDToFull(shortProcessId as string);
  const navigate = useNavigate();

  const { data, loading, error } = useQuery(ProcessDocument, {
    variables: {
      processId: processId,
    },
  });

  const onError = () => {
    navigate(Routes.newRequestRoute(Routes.NewRequestRoute.SelectProcess));
  };

  const process = data?.process as ProcessSummaryPartsFragment;

  const formSchema = z.object(
    formState.process
      ? formState.process.inputs.reduce(
          (acc, input) => ({
            ...acc,
            [input.id]: createInputValidation(input.type, input.required),
          }),
          {},
        )
      : {},
  );

  type FormFields = z.infer<typeof formSchema>;

  const { control, handleSubmit } = useForm({
    defaultValues: formState.process
      ? formState.process.inputs.reduce(
          (acc, input) => ({ ...acc, [input.id]: "" }),
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
    onNext();
    // navigate("confirm");
  };

  useEffect(() => {
    setFormState({ process });
  }, [process, setFormState]);

  if (error) onError();

  return loading ? (
    <Loading />
  ) : (
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
          <Typography fontWeight={600} color="primary">
            Process: {process.name}
          </Typography>
          <Typography variant="body1">
            Your request will have the following options:
          </Typography>
          <ProcessOptions options={formState?.process?.options ?? []} />
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
                  key={input.id}
                  label={input.name}
                  control={control}
                  name={input.id}
                  required={input.required}
                  placeholder={input.description ?? ""}
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
