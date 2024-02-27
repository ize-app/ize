import { useQuery } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import * as z from "zod";

import { useNewRequestWizardState } from "./newRequestWizard";
import { FieldDataType, FieldType, Flow, GetFlowDocument } from "../../graphql/generated/graphql";
import * as Routes from "../../routers/routes";
import { shortUUIDToFull } from "../../utils/inputs";
import Loading from "../shared/Loading";
import { WizardBody, WizardNav } from "../shared/Wizard";
import { DatePicker, DateTimePicker, TextField } from "../shared/Form/FormFields";
import { ResponseField } from "./ResponseField";
import { requestDefinedOptionsSchema, requestFieldsSchema } from "./validation";

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

  const formSchema = z.object({
    requestFields: requestFieldsSchema,
    requestDefinedOptions: requestDefinedOptionsSchema,
  });

  // zod record with a data type,

  type FormFields = z.infer<typeof formSchema>;
  const {
    control,
    setValue,
    handleSubmit,
    formState: reactHookFormState,
  } = useForm({
    defaultValues: {
      requestFields: formState.requestFields
        ? formState.requestFields
        : step
          ? step.request.fields.reduce((acc, field) => {
              if (field.__typename !== FieldType.FreeInput) throw Error("Invlid field type");
              return {
                ...acc,
                [field.fieldId]: undefined, // field.dataType === FieldDataType.Date ? undefined : "",
              };
            }, {})
          : {},
    },
    resolver: zodResolver(formSchema),
    shouldUnregister: true,
  });

  console.log("errors are ", reactHookFormState.errors);

  const onSubmit = (data: FormFields) => {
    setFormState((prev) => ({
      ...prev,
      requestFields: data.requestFields,
      requestDefinedOptions: {},
    }));
    onNext();
    // navigate("confirm");
  };

  useEffect(() => {
    setFormState({ flow: flow });
    if (step) {
      step.request.fields.forEach((field) => {
        if (field.__typename === FieldType.FreeInput) {
          // @ts-ignore not sure why react hook forms isn't picking up on record type
          setValue(`requestFields.${field.fieldId}.dataType`, field.dataType);
          // @ts-ignore not sure why react hook forms isn't picking up on record type
          setValue(`requestFields.${field.fieldId}.required`, field.required);
        }
      });
    }
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
            Flow: {flow.name}
          </Typography>

          {/* <Typography variant="body1">Your request will have the following options:</Typography> */}
          {/* <ProcessOptions options={formState?.process?.options ?? []} /> */}
          <Typography>Add some context about this request...</Typography>
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
                      name={`requestFields.${field.fieldId}.value`}
                      key={fieldId}
                      control={control}
                      // showLabel={false}

                      label={name}
                    />
                  );
                case FieldDataType.DateTime:
                  return (
                    <DateTimePicker<FormFields>
                      name={`requestFields.${field.fieldId}.value`}
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
                      name={`requestFields.${field.fieldId}.value`}
                      required={required}
                      multiline
                    />
                  );
              }
            })}
          </Box>
          <Typography>How respondants will be able to respond:</Typography>
          <ResponseField field={step?.response.fields[0]} />
        </Box>
      </WizardBody>
      <WizardNav onNext={handleSubmit(onSubmit)} onPrev={onPrev} nextLabel={nextLabel} />
    </>
  );
};
