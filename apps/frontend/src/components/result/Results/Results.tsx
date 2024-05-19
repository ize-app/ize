import {
  FieldFragment,
  ResultConfigFragment,
  ResultFragment,
  UserFieldAnswersFragment,
} from "@/graphql/generated/graphql";
import Box from "@mui/material/Box";
import { Result } from "./Result";
import { LabeledGroupedInputs } from "../../Form/formLayout/LabeledGroupedInputs";
import { Status } from "@/graphql/generated/graphql";
import { Chip } from "@mui/material";
import { statusProps } from "@/components/status/statusProps";
import { UserFieldAnswers } from "@/components/Field/UserFieldAnswers";

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
  requestStatus: Status;
  fieldsAnswers: UserFieldAnswersFragment[];
}) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      {resultConfigs.map((resultConfig) => {
        let field: FieldFragment | null = null;
        let result: ResultFragment | null =
          results.find((r) => r.resultConfigId === resultConfig.resultConfigId) ?? null;

        let fieldAnswers: UserFieldAnswersFragment | undefined = fieldsAnswers.find((answer) => {
          return answer.fieldId === resultConfig.fieldId;
        });

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
                label={statusProps[requestStatus].label}
                sx={{
                  backgroundColor: statusProps[requestStatus].backgroundColor,
                  color: statusProps[requestStatus].color,
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
                borderColor: statusProps[requestStatus].backgroundColor,
                backgroundColor:
                  requestStatus === Status.Completed
                    ? "#f5faf5"
                    : requestStatus === Status.InProgress
                      ? "#f3f8fb"
                      : "white",
              }}
              key={resultConfig.resultConfigId}
            >
              <Result resultConfig={resultConfig} field={field} result={result} />
              {fieldAnswers && field && (
                <UserFieldAnswers userFieldAnswers={fieldAnswers} field={field} />
              )}
            </LabeledGroupedInputs>
          </Box>
        );
      })}
    </Box>
  );
};
