import { Typography } from "@mui/material";
import Box from "@mui/material/Box";

import { TriggerDefinedOptions } from "@/graphql/generated/graphql";

import { FreeInputValue } from "./FreeInputValue";

export const TriggerDefinedOptionSets = ({
  triggerDefinedOptionSets,
}: {
  triggerDefinedOptionSets: TriggerDefinedOptions[];
}) => {
  if (triggerDefinedOptionSets.length === 0) return null;
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <Typography variant="description">
        Options added to questions in this request
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: "8px", maxWidth: "400px" }}>
        {triggerDefinedOptionSets.map((triggerDefinedOptions) => {
          return (
            <Box
              key={"triggeroptions" + triggerDefinedOptions.fieldId}
              sx={{
                display: "flex",
                flexDirection: "column",
                outline: "1px solid rgba(0, 0, 0, 0.1)",
                padding: "2px 6px",
              }}
            >
              <Typography variant="description">{triggerDefinedOptions.fieldName}</Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {triggerDefinedOptions.options.map((option) => (
                  <FreeInputValue
                    key={option.optionId}
                    value={option.name}
                    type={option.dataType}
                  />
                ))}
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};
