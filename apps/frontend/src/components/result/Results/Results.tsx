import {
  FieldFragment,
  ResultConfigFragment,
  ResultFragment,
  UserFieldAnswersFragment,
} from "@/graphql/generated/graphql";
import Box from "@mui/material/Box";
import { Result } from "./Result";
import { LabeledGroupedInputs } from "../../Form/formLayout/LabeledGroupedInputs";
import { RequestStatus } from "@/components/status/type";
import { Chip, Typography } from "@mui/material";
import { requestStatusProps } from "@/components/status/requestStatusProps";
import { CurrentUserContext } from "@/contexts/current_user_context";
import { useContext } from "react";
import { UserFieldAnswer } from "@/components/ConfigDiagram/ConfigDiagramFlow/Field/UserFieldAnswer";

export const Results = ({
  resultConfigs,
  responseFields,
  results,
  requestStatus,
  fieldsAnswers,
}: {
  resultConfigs: ResultConfigFragment[];
  responseFields: FieldFragment[];
  results: ResultFragment[];
  requestStatus: RequestStatus;
  fieldsAnswers: UserFieldAnswersFragment[];
}) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      {resultConfigs.map((resultConfig) => {
        const { me } = useContext(CurrentUserContext);
        let field: FieldFragment | null = null;
        let result: ResultFragment | null =
          results.find((r) => r.resultConfigId === resultConfig.resultConfigId) ?? null;

        let fieldAnswers: UserFieldAnswersFragment | undefined = fieldsAnswers.find((answer) => {
          return answer.fieldId === resultConfig.fieldId;
        });

        let userFieldAnswers = fieldAnswers?.answers.filter((a) => a.user.id === me?.user.id) ?? [];

        if (resultConfig.fieldId) {
          field = responseFields.find((field) => field.fieldId === resultConfig.fieldId) ?? null;
        }

        return (
          <Box
            key={resultConfig.resultConfigId}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "4px",
              alignItems: "flex-start",
            }}
          >
            <Box sx={{ display: "flex", width: "100%", justifyContent: "flex-end" }}>
              <Chip
                label={requestStatusProps[requestStatus].label}
                sx={{
                  backgroundColor: requestStatusProps[requestStatus].backgroundColor,
                  color: requestStatusProps[requestStatus].color,
                }}
                size="small"
              />
            </Box>
            <LabeledGroupedInputs
              sx={{
                padding: "8px 16px 16px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                borderColor: requestStatusProps[requestStatus].backgroundColor,
                backgroundColor:
                  requestStatus === RequestStatus.Completed
                    ? "#f5faf5"
                    : requestStatus === RequestStatus.InProgress
                      ? "#f3f8fb"
                      : "white",
              }}
              key={resultConfig.resultConfigId}
            >
              <Result resultConfig={resultConfig} field={field} result={result} />
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  outline: "1px solid rgba(0, 0, 0, 0.1)",
                  padding: "12px",
                  marginTop: "8px",
                }}
              >
                <Typography variant={"description"}>You responded:</Typography>
                {field &&
                  userFieldAnswers.map((a, index) => {
                    return <UserFieldAnswer key={index} field={field} userFieldAnswer={a} />;
                  })}
              </Box>
            </LabeledGroupedInputs>
          </Box>
        );
      })}
    </Box>
  );
};
