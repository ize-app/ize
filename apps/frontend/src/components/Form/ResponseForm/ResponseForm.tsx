import { useMutation } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { useContext, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import {
  FieldDataType,
  FieldFragment,
  FieldType,
  NewResponseDocument,
  OptionSelectionType,
  PermissionFragment,
} from "@/graphql/generated/graphql";
import { CurrentUserContext } from "@/hooks/contexts/current_user_context";
import { SnackbarContext } from "@/hooks/contexts/SnackbarContext";

import { createResponseFormState } from "./createResponseFormState";
import { ResponseSchemaType, responseSchema } from "./formValidation";
import { DatePicker, DateTimePicker, MultiSelect, SortableList, TextField } from "../formFields";
import { Radio } from "../formFields/Radio";
import { createFieldAnswersArgs } from "../utils/createFieldAnswers";

export const ResponseForm = ({
  responseFields,
  requestStepId,
  permission,
}: {
  responseFields: FieldFragment[];
  requestStepId: string;
  permission: PermissionFragment | undefined | null;
}) => {
  const { setSnackbarData, setSnackbarOpen } = useContext(SnackbarContext);
  const [disableSubmit, setDisableSubmit] = useState(false);
  const navigate = useNavigate();
  const { setIdentityModalState } = useContext(CurrentUserContext);
  const [mutate] = useMutation(NewResponseDocument, {
    onCompleted: (_data) => {
      navigate(0);
      // TODO: maybe add a 1 second timer here so that the user can see the success message
      setSnackbarOpen(true);
      setSnackbarData({ message: "Response submitted!", type: "success" });
    },
    onError: (data) => {
      if (data.graphQLErrors[0]?.extensions?.code === "InsufficientPermissions") {
        setIdentityModalState({ type: "response", permission });
      }

      setSnackbarOpen(true);
      setSnackbarData({ message: "Response submission failed", type: "error" });
    },
  });

  const formMethods = useForm({
    defaultValues: createResponseFormState({ fields: responseFields }),
    resolver: zodResolver(responseSchema),
    shouldUnregister: false,
  });

  // console.log("form state is ", formMethods.getValues());
  // console.log("errors are", formMethods.formState.errors);

  const onSubmit = async (data: ResponseSchemaType) => {
    setDisableSubmit(true);
    await mutate({
      variables: {
        response: {
          responseId: data.responseId,
          requestStepId,
          answers: await createFieldAnswersArgs(data.responseFields),
        },
      },
    });
    setDisableSubmit(false);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        width: "100%",
        padding: "16px",
      }}
    >
      <Typography color="primary" variant="label" fontSize="1rem" marginBottom="12px">
        Respond
      </Typography>
      <FormProvider {...formMethods}>
        <form
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          {responseFields
            .filter((f) => !f.isInternal)
            .map((field) => {
              switch (field.__typename) {
                case FieldType.FreeInput: {
                  const { dataType, name, required, fieldId } = field;

                  switch (dataType) {
                    case FieldDataType.Date:
                      return (
                        <DatePicker<ResponseSchemaType>
                          name={`responseFields.${field.fieldId}.value`}
                          key={fieldId}
                          // showLabel={false}

                          label={name}
                        />
                      );
                    case FieldDataType.DateTime:
                      return (
                        <DateTimePicker<ResponseSchemaType>
                          name={`responseFields.${field.fieldId}.value`}
                          key={fieldId}
                          label={name}
                        />
                      );
                    default:
                      return (
                        <TextField<ResponseSchemaType>
                          key={fieldId}
                          label={name}
                          seperateLabel={true}
                          variant="outlined"
                          showLabel={true}
                          name={`responseFields.${field.fieldId}.value`}
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
                        <Radio<ResponseSchemaType>
                          name={`responseFields.${field.fieldId}.optionSelections[0].optionId`}
                          key={fieldId}
                          label={name}
                          sx={{ flexDirection: "column", gap: "4px" }}
                          options={options.map((option) => ({
                            label: option.name,
                            value: option.optionId,
                          }))}
                        />
                      );
                    }
                    case OptionSelectionType.MultiSelect: {
                      return (
                        <MultiSelect<ResponseSchemaType>
                          name={`responseFields.${field.fieldId}.optionSelections`}
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
                    case OptionSelectionType.Rank: {
                      return (
                        <SortableList<ResponseSchemaType>
                          label={name}
                          key={fieldId}
                          formMethods={formMethods}
                          name={`responseFields.${field.fieldId}.optionSelections`}
                          options={options.map((option) => ({
                            label: option.name,
                            value: option.optionId,
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

          <Button
            variant={"contained"}
            size="small"
            disabled={disableSubmit}
            sx={{ width: "200px", alignSelf: "flex-start" }}
            onClick={formMethods.handleSubmit(onSubmit)}
          >
            Submit
          </Button>
        </form>
      </FormProvider>
    </Box>
  );
};
