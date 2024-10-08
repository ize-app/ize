import { useMutation } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@mui/material";
import Box from "@mui/material/Box";
import { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import {
  FieldDataType,
  FieldFragment,
  FieldOptionsSelectionType,
  FieldType,
  NewResponseDocument,
  PermissionFragment,
} from "@/graphql/generated/graphql";
import { CurrentUserContext } from "@/hooks/contexts/current_user_context";
import { SnackbarContext } from "@/hooks/contexts/SnackbarContext";

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
      if (data.graphQLErrors[0].extensions.code === "InsufficientPermissions") {
        setIdentityModalState({ type: "response", permission });
      }

      setSnackbarOpen(true);
      setSnackbarData({ message: "Response submission failed", type: "error" });
    },
  });

  useEffect(() => {
    responseFields.forEach((field) => {
      if (field.__typename === FieldType.FreeInput) {
        // @ts-expect-error not sure why react hook forms isn't picking up on record type
        formMethods.setValue(`responseFields.${field.fieldId}.dataType`, field.dataType);
        // @ts-expect-error not sure why react hook forms isn't picking up on record type
        formMethods.setValue(`responseFields.${field.fieldId}.required`, field.required);
      } else if (field.__typename === FieldType.Options) {
        // @ts-expect-error not sure why react hook forms isn't picking up on record type
        formMethods.setValue(`responseFields.${field.fieldId}.selectionType`, field.selectionType);
        // @ts-expect-error not sure why react hook forms isn't picking up on record type
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

  const onSubmit = async (data: ResponseSchemaType) => {
    await mutate({
      variables: {
        response: {
          requestStepId,
          answers: await createFieldAnswersArgs(data.responseFields),
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
        padding: "16px",
      }}
    >
      {/* <Typography color="primary" variant="label" fontSize="1rem" marginBottom="12px">
        Respond
      </Typography> */}
      <form
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
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
                  return (
                    <SortableList<ResponseSchemaType>
                      control={formMethods.control}
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
          sx={{ width: "200px" }}
          onClick={formMethods.handleSubmit(onSubmit)}
        >
          Submit
        </Button>
      </form>
    </Box>
  );
};
