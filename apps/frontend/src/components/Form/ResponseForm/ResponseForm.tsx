import { useMutation } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import Box from "@mui/material/Box";
import { useForm } from "react-hook-form";

import {
  FieldDataType,
  FieldFragment,
  FieldOptionsSelectionType,
  FieldType,
  NewResponseDocument,
} from "../../../graphql/generated/graphql";
import { DatePicker, DateTimePicker, MultiSelect, TextField } from "../formFields";
import { ResponseSchemaType, responseSchema } from "./formValidation";
import { Radio } from "../formFields/Radio";
import { Button } from "@mui/material";
import { SnackbarContext } from "../../../contexts/SnackbarContext";
import { useContext, useEffect } from "react";
import { createFieldAnswersArgs } from "../utils/createFieldAnswers";

export const ResponseForm = ({
  responseFields,
  requestStepId,
}: {
  responseFields: FieldFragment[];
  requestStepId: string;
}) => {
  const { setSnackbarData, setSnackbarOpen } = useContext(SnackbarContext);
  const [mutate] = useMutation(NewResponseDocument, {
    onCompleted: (_data) => {
      setSnackbarOpen(true);
      setSnackbarData({ message: "Response submitted!", type: "success" });
      console.log("successfully submitted response");
      // window.location.reload();
    },
    onError: (data) => {
      console.log("Error submitting response: ", data.message);
      setSnackbarOpen(true);
      setSnackbarData({ message: "Response submission failed", type: "error" });
    },
  });

  useEffect(() => {
    responseFields.forEach((field) => {
      if (field.__typename === FieldType.FreeInput) {
        // @ts-ignore not sure why react hook forms isn't picking up on record type
        formMethods.setValue(`responseFields.${field.fieldId}.dataType`, field.dataType);
        // @ts-ignore not sure why react hook forms isn't picking up on record type
        formMethods.setValue(`responseFields.${field.fieldId}.required`, field.required);
      } else if (field.__typename === FieldType.Options) {
        // @ts-ignore not sure why react hook forms isn't picking up on record type
        formMethods.setValue(`responseFields.${field.fieldId}.selectionType`, field.selectionType);
        // @ts-ignore not sure why react hook forms isn't picking up on record type
        formMethods.setValue(`responseFields.${field.fieldId}.maxSelections`, field.maxSelections);
      }
    });
  }, [responseFields]);

  const formMethods = useForm({
    defaultValues: {},
    resolver: zodResolver(responseSchema),
    shouldUnregister: true,
  });

  // console.log("errors are", formMethods.formState.errors);
  // console.log("formstate is ", formMethods.getValues());

  const onSubmit = async (data: ResponseSchemaType) => {
    await mutate({
      variables: {
        response: {
          requestStepId,
          answers: createFieldAnswersArgs(data.responseFields),
        },
      },
    });
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        width: "100%",
      }}
    >
      <form
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          padding: "16px",
        }}
      >
        {responseFields.map((field) => {
          switch (field.__typename) {
            case FieldType.FreeInput: {
              const { dataType, name, required, fieldId } = field;

              switch (dataType) {
                case FieldDataType.Date:
                  return (
                    <DatePicker<ResponseSchemaType>
                      name={`responseFields.${field.fieldId}.value`}
                      key={fieldId}
                      control={formMethods.control}
                      // showLabel={false}

                      label={name}
                    />
                  );
                case FieldDataType.DateTime:
                  return (
                    <DateTimePicker<ResponseSchemaType>
                      name={`responseFields.${field.fieldId}.value`}
                      key={fieldId}
                      control={formMethods.control}
                      label={name}
                    />
                  );
                default:
                  return (
                    <TextField<ResponseSchemaType>
                      key={fieldId}
                      label={name}
                      variant="outlined"
                      showLabel={true}
                      control={formMethods.control}
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
                case FieldOptionsSelectionType.Select: {
                  return (
                    <Radio<ResponseSchemaType>
                      name={`responseFields.${field.fieldId}.optionSelections[0].optionId`}
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
                    <MultiSelect<ResponseSchemaType>
                      name={`responseFields.${field.fieldId}.optionSelections`}
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
                  return null;
                }
              }
            }
            default:
              throw Error("Invalid field type");
          }
        })}

        <Button
          variant={"contained"}
          size="small"
          sx={{ width: "200px" }}
          onClick={formMethods.handleSubmit(onSubmit)}
        >
          Submit
        </Button>
      </form>
    </Box>
  );
};
