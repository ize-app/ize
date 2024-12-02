import { useMutation } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { useContext, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import {
  FieldFragment,
  NewResponseDocument,
  PermissionFragment,
} from "@/graphql/generated/graphql";
import { CurrentUserContext } from "@/hooks/contexts/current_user_context";
import { SnackbarContext } from "@/hooks/contexts/SnackbarContext";

import { createResponseFormState } from "./createResponseFormState";
import { ResponseSchemaType, responseSchema } from "./responseValidation";
import { createFieldAnswersArgs } from "../InputField/createMutationArgs/createFieldAnswerArgs";
import { InputFieldAnswers } from "../InputField/InputFieldAnswers";

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

  console.log("form state is ", formMethods.getValues());
  console.log("errors are", formMethods.formState.errors);

  const onSubmit = async (data: ResponseSchemaType) => {
    console.log("submitting response", data);
    setDisableSubmit(true);
    await mutate({
      variables: {
        response: {
          responseId: data.responseId,
          requestStepId,
          answers: createFieldAnswersArgs(data.responseFields),
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
      <Typography color="primary" variant="label" fontSize="1rem">
        Respond
      </Typography>
      <FormProvider {...formMethods}>
        <form
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <InputFieldAnswers<ResponseSchemaType>
            fields={responseFields}
            basePath={`responseFields`}
          />

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
