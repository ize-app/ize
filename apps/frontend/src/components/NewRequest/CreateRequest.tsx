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
  Field,
  FieldDataType,
  FieldType,
  Flow,
  GetFlowDocument,
  InputDataType,
  ProcessDocument,
  ProcessSummaryPartsFragment,
} from "../../graphql/generated/graphql";
import * as Routes from "../../routers/routes";
import { shortUUIDToFull, zodCleanNumber, zodCleanString } from "../../utils/inputs";
import { TextFieldControl } from "../shared/Form";
import Loading from "../shared/Loading";
import { ProcessOptions } from "../shared/Process/ProcessOptions";
import { WizardBody, WizardNav } from "../shared/Wizard";
import { DatePicker, DateTimePicker, TextField } from "../shared/Form/FormFields";
import { zodDay } from "../shared/Form/validation";

const createFreeInputValidation = (field: Field) => {
  if (field.__typename !== FieldType.FreeInput) throw Error("Invlid field type");
  const { dataType, name, required, fieldId } = field;
  let val: z.ZodTypeAny = z.any();
  switch (dataType) {
    case FieldDataType.Number:
      val = zodCleanNumber(
        required
          ? z.number({ invalid_type_error: "Please enter a valid number" })
          : z.number({ invalid_type_error: "Please enter a valid number" }).optional(),
      );
      break;
    case FieldDataType.String:
      val = zodCleanString(required ? z.string().min(1) : z.string().min(1).optional());
      break;
    case FieldDataType.Uri:
      val = zodCleanString(required ? z.string().url() : z.string().url().optional());
      break;
    case FieldDataType.Date:
      val = required ? zodDay : zodDay.optional();
      break;
    case FieldDataType.DateTime:
      val = required ? zodDay : zodDay.optional();
      break;
    default:
      throw Error("Invalid free input field type");
  }
  return val;
};

export const CreateRequest = () => {
  const { formState, setFormState, onPrev, onNext, nextLabel, setParams } =
    useNewRequestWizardState();
  const { flowId: shortFlowId } = useParams();

  useEffect(() => setParams({ flowId: shortFlowId }), [shortFlowId, setParams]);

  const flowId = shortUUIDToFull(shortFlowId as string);
  const navigate = useNavigate();

  const { data, loading, error } = useQuery(GetFlowDocument, {
    variables: {
      flowId,
    },
  });

  const onError = () => {
    navigate(Routes.newRequestRoute(Routes.NewRequestRoute.SelectFlow));
  };

  const flow = data?.getFlow as Flow;
  const step = flow.steps[0];

  console.log("step is ", step);
  const formSchema = z.object(
    step
      ? step.request.fields.reduce(
          (acc, field) => ({
            ...acc,
            [field.fieldId]: createFreeInputValidation(field),
          }),
          {},
        )
      : {},
  );

  type FormFields = z.infer<typeof formSchema>;

  const { control, handleSubmit } = useForm({
    defaultValues: step
      ? step.request.fields.reduce((acc, field) => ({ ...acc, [field.fieldId]: "" }), {})
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
    setFormState({ flow: flow });
  }, [flow, setFormState]);

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
            Process: {flow.name}
          </Typography>
          {/* <Typography variant="body1">Your request will have the following options:</Typography> */}
          {/* <ProcessOptions options={formState?.process?.options ?? []} /> */}
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            maxWidth: "800px",
          }}
        >
          {//control ?
          step?.request.fields.map((field) => {
            if (field.__typename !== FieldType.FreeInput) throw Error("Invlid field type");
            const { dataType, name, required, fieldId } = field;

            switch (dataType) {
              case FieldDataType.Date:
                return (
                  <DatePicker<FormFields>
                    name={fieldId}
                    key={fieldId}
                    control={control}
                    // showLabel={false}

                    label={name}
                  />
                );
              case FieldDataType.DateTime:
                return (
                  <DateTimePicker<FormFields>
                    name={fieldId}
                    key={fieldId}
                    control={control}
                    // showLabel={false}
                    label={name}
                  />
                );
              default:
                return (
                  <TextField<FormFields>
                    key={fieldId}
                    label={name}
                    variant="outlined"
                    showLabel={true}
                    control={control}
                    name={fieldId}
                    required={required}
                  />
                );
            }
          })}
        </Box>
      </WizardBody>
      <WizardNav onNext={handleSubmit(onSubmit)} onPrev={onPrev} nextLabel={nextLabel} />
    </>
  );
};
