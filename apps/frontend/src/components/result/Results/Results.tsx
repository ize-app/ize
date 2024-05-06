import { FieldFragment, ResultConfigFragment, ResultFragment } from "@/graphql/generated/graphql";
import Box from "@mui/material/Box";
import { Result } from "./Result";
import { LabeledGroupedInputs } from "../../Form/formLayout/LabeledGroupedInputs";
import { RequestStatus } from "@/components/status/type";
import { Chip } from "@mui/material";
import { requestStatusProps } from "@/components/status/requestStatusProps";

export const Results = ({
  resultConfigs,
  responseFields,
  results,
  requestStatus,
}: {
  resultConfigs: ResultConfigFragment[];
  responseFields: FieldFragment[];
  results: ResultFragment[];
  requestStatus: RequestStatus;
}) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      {resultConfigs.map((resultConfig) => {
        let field: FieldFragment | null = null;
        let result: ResultFragment | null =
          results.find((r) => r.resultConfigId === resultConfig.resultConfigId) ?? null;

        if (resultConfig.fieldId) {
          field = responseFields.find((field) => field.fieldId === resultConfig.fieldId) ?? null;
        }

        return (
          <Box
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
            </LabeledGroupedInputs>
          </Box>
        );
      })}
    </Box>
  );
};
