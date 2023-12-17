import { useMutation } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import Tooltip from "@mui/material/Tooltip";
import * as z from "zod";

import { SnackbarContext } from "@/contexts/SnackbarContext";
import {
  AgentSummaryPartsFragment,
  NewResponseDocument,
  ProcessOption,
  Response,
} from "@/graphql/generated/graphql";
import { RadioControl } from "../Form";
import { CurrentUserContext } from "@/contexts/current_user_context";
import { hasPermission } from "@/utils/hasPermissions";

const formSchema = z.object({
  option: z.string().trim().nonempty("Please select an option"),
});

type FormFields = z.infer<typeof formSchema>;

export const SubmitResponse = ({
  requestId,
  options,
  onSubmit,
  userResponse,
  displayAsColumn,
  respondRoles,
}: {
  requestId: string;
  options: ProcessOption[];
  onSubmit: () => void;
  userResponse: Response | null | undefined;
  displayAsColumn: boolean;
  respondRoles: AgentSummaryPartsFragment[];
}) => {
  const { me } = useContext(CurrentUserContext);

  const userLoggedIn = !!me?.user;
  const hasRespondRole = hasPermission(me?.user.id, me?.groupIds, respondRoles);
  const [hasResponded, setHasResponded] = useState<boolean>(!!userResponse);

  const canRespond = userLoggedIn && hasRespondRole && !hasResponded;

  const { setSnackbarOpen, setSnackbarData, snackbarData } = useContext(SnackbarContext);

  const [mutate] = useMutation(NewResponseDocument);

  const onComplete = async (data: FormFields) => {
    try {
      setSnackbarOpen(true);
      setHasResponded(true);
      await mutate({
        variables: {
          requestId: requestId,
          optionId: data.option,
        },
      });
      setSnackbarData({
        ...snackbarData,
        message: "Response submitted!",
        type: "success",
      });
      onSubmit();
    } catch {
      setSnackbarOpen(true);
      setSnackbarData({
        ...snackbarData,
        message: "Response failed",
        type: "error",
      });
    }
  };

  const { control, handleSubmit } = useForm<FormFields>({
    defaultValues: {
      option: userResponse?.optionId ? userResponse?.optionId : "",
    },
    resolver: zodResolver(formSchema),
    shouldUnregister: true,
  });

  return (
    <Tooltip
      title={
        !hasRespondRole ? "You don't have the 'Respond' role for this request" : "Log in to respond"
      }
      disableHoverListener={hasRespondRole && userLoggedIn}
    >
      <Box
        component={"form"}
        sx={(theme) => ({
          display: "flex",
          padding: "16px",
          flexDirection: displayAsColumn ? "column" : "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
          alignSelf: "stretch",
          [theme.breakpoints.down("sm")]: {
            flexDirection: "column",
          },
        })}
      >
        <Box sx={{ width: "100%", height: "100%" }}>
          <RadioControl
            name="option"
            //@ts-ignore
            control={control}
            disabled={!canRespond}
            sx={{ flexDirection: "column", gap: "4px" }}
            options={options.map((option) => ({
              label: option.value,
              value: option.id,
            }))}
          />
        </Box>
        {hasResponded ? (
          <Typography sx={{ marginTop: "8px" }}>
            Responded on{" "}
            {(userResponse
              ? new Date(Date.parse(userResponse?.createdAt))
              : new Date()
            ).toLocaleDateString("en-us", {
              day: "numeric",
              year: "numeric",
              month: "long",
            })}
          </Typography>
        ) : null}

        <Box
          sx={{
            minWidth: "120px",
            height: "100%",
            padding: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {canRespond ? (
            <Button variant="contained" onClick={handleSubmit(onComplete)}>
              Submit
            </Button>
          ) : null}
        </Box>
      </Box>
    </Tooltip>
  );
};
