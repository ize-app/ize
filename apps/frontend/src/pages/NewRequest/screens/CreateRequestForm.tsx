import { useQuery } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

import { WizardScreenBodyNarrow } from "@/components/Wizard/WizardScreenBodyNarrow";

import {
  DatePicker,
  DateTimePicker,
  MultiSelect,
  SortableList,
  TextField,
} from "../../../components/Form/formFields";
import { Radio } from "../../../components/Form/formFields/Radio";
import Loading from "../../../components/Loading";
import { WizardNav } from "../../../components/Wizard";
import {
  FieldDataType,
  FieldOptionsSelectionType,
  FieldType,
  Flow,
  FlowType,
  GetFlowDocument,
} from "../../../graphql/generated/graphql";
import * as Routes from "../../../routers/routes";
import { shortUUIDToFull } from "../../../utils/inputs";
import { CreateRequestResponseFieldForm } from "../components/CreateRequestResponseFieldForm";
import { RequestSchemaType, requestSchema } from "../formValidation";
import { useNewRequestWizardState } from "../newRequestWizard";

export const CreateRequestForm = () => {
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
  const step = flow ? flow.steps[0] : null;

  // Users shouldn't be able to create requests for evolve flows directly in the UI
  if (flow && flow.type === FlowType.Evolve)
    navigate(Routes.newRequestRoute(Routes.NewRequestRoute.SelectFlow));

  useEffect(() => {
    if (step && !loading) {
      setFormState((prev) => ({ ...prev, flow: flow }));
      step.request.fields.forEach((field) => {
        if (field.__typename === FieldType.FreeInput) {
          // @ts-ignore not sure why react hook forms isn't picking up on record type
          formMethods.setValue(`requestFields.${field.fieldId}.dataType`, field.dataType);
          // @ts-ignore not sure why react hook forms isn't picking up on record type
          formMethods.setValue(`requestFields.${field.fieldId}.required`, field.required);
        } else if (field.__typename === FieldType.Options) {
          // @ts-ignore not sure why react hook forms isn't picking up on record type
          formMethods.setValue(`requestFields.${field.fieldId}.selectionType`, field.selectionType);
          // @ts-ignore not sure why react hook forms isn't picking up on record type
          formMethods.setValue(`requestFields.${field.fieldId}.maxSelections`, field.maxSelections);
        }
      });
    }
  }, [step, loading, setFormState]);

  const formMethods = useForm({
    defaultValues: formState ?? {},
    resolver: zodResolver(requestSchema),
    shouldUnregister: true,
  });

  console.log("form state is ", formMethods.getValues());
  console.log("errors are  ", formMethods.formState.errors);

  // console.log("errors are", formMethods.formState.errors);
  // console.log("formstate is ", formMethods.getValues());

  const onSubmit = (data: RequestSchemaType) => {
    setFormState((prev) => ({
      ...prev,
      flow,
      name: data.name,
      requestFields: data.requestFields ?? undefined,
      requestDefinedOptions: data.requestDefinedOptions ?? [],
    }));
    onNext();
  };

  if (error) onError();

  if (!flow || loading) {
    return <Loading />;
  }

  return loading ? (
    <Loading />
  ) : (
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
