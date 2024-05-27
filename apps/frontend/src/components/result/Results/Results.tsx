import { Chip } from "@mui/material";
import Box from "@mui/material/Box";

import { UserFieldAnswers } from "@/components/Field/UserFieldAnswers";
import { statusProps } from "@/components/status/statusProps";
import {
  FieldFragment,
  ResultConfigFragment,
  ResultFragment,
  Status,
  UserFieldAnswersFragment,
} from "@/graphql/generated/graphql";

import { Result } from "./Result";
import { LabeledGroupedInputs } from "../../Form/formLayout/LabeledGroupedInputs";

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
        const result: ResultFragment | null =
          results.find((r) => r.resultConfigId === resultConfig.resultConfigId) ?? null;

        const fieldAnswers: UserFieldAnswersFragment | undefined = fieldsAnswers.find((answer) => {
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
                <UserFieldAnswers userFieldAnswers={fieldAnswers} field={field} key={result?.id} />
              )}
            </LabeledGroupedInputs>
          </Box>
        );
      })}
    </Box>
  );
};
