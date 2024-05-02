import { FieldFragment, ResultConfigFragment } from "@/graphql/generated/graphql";
import Box from "@mui/material/Box";
import { ResultConfig } from "./ResultConfig";
import { LabeledGroupedInputs } from "../Form/formLayout/LabeledGroupedInputs";

export const ResultConfigs = ({
  resultConfigs,
  responseFields,
}: {
  resultConfigs: ResultConfigFragment[];
  responseFields: FieldFragment[];
}) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      {resultConfigs.map((resultConfig) => {
        let field: FieldFragment | null = null;

        if (resultConfig.fieldId) {
          field = responseFields.find((field) => field.fieldId === resultConfig.fieldId) ?? null;
        }
        return (
          <LabeledGroupedInputs sx={{ padding: "16px" }}>
            <ResultConfig
              key={resultConfig.resultConfigId}
              resultConfig={resultConfig}
              field={field}
            />
          </LabeledGroupedInputs>
        );
      })}
    </Box>
  );
};
