import Box from "@mui/material/Box";
import InputAdornment from "@mui/material/InputAdornment";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { Control } from "react-hook-form";

import { SelectControl, TextFieldControl } from "@/components/shared/Form";
import { DecisionType } from "@/components/shared/Form/ProcessForm/types";
import { AgentSummaryPartsFragment } from "@/graphql/generated/graphql";
import { RoleSearchControl } from "../../RoleSearchControl";
import { GetFieldValues, SetFieldValue } from "../wizardScreens/Roles";

const RolesContainer = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      gap: "8px",
    }}
  >
    <Typography variant={"h3"}>{title}</Typography>
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        padding: "12px",
      }}
    >
      {children}
    </Box>
  </Box>
);

const RolesAndDecisionSystem = ({
  control,
  agents,
  isPercentageThreshold,
  namePrepend = "",
  setFieldValue,
  getFieldValues,
}: {
  control: Control;
  agents: AgentSummaryPartsFragment[];
  isPercentageThreshold: boolean;
  namePrepend?: string;
  setFieldValue: SetFieldValue;
  getFieldValues: GetFieldValues;
}) => {
  return (
    <>
      <RolesContainer title={"Request"}>
        <RoleSearchControl //@ts-ignore
          control={control}
          name={namePrepend + "rights.request"}
          label={"Who can create requests?"}
          agents={agents}
          setFieldValue={setFieldValue}
          getFieldValues={getFieldValues}
        />
        <SelectControl
          //@ts-ignore
          control={control}
          sx={{ width: "300px" }}
          name={namePrepend + "decision.requestExpirationSeconds"}
          selectOptions={[
            { name: "1 hour", value: 3600 },
            { name: "4 hours", value: 14400 },
            { name: "1 day", value: 86400 },
            { name: "3 days", value: 259200 },
            { name: "7 days", value: 604800 },
            { name: "30 days", value: 2592000 },
          ]}
          label="Days until request expires"
        />
      </RolesContainer>
      <RolesContainer title={"Response"}>
        <RoleSearchControl //@ts-ignore
          control={control}
          name={namePrepend + "rights.response"}
          label={"Who can respond to requests?"}
          agents={agents}
          setFieldValue={setFieldValue}
          getFieldValues={getFieldValues}
        />
        <Box
          sx={{
            display: "flex",
            gap: "24px",
            justifyContent: "flex-start",
            flexWrap: "wrap",
          }}
        >
          <Box sx={{}}>
            <SelectControl
              //@ts-ignore
              control={control}
              name={namePrepend + "decision.type"}
              sx={{ width: "300px" }}
              selectOptions={[
                {
                  value: DecisionType.Absolute,
                  name: "Threshold vote",
                },
                {
                  value: DecisionType.Percentage,
                  name: "Percentage vote",
                },
              ]}
              label="When is there a final result?"
            />
          </Box>
          {isPercentageThreshold ? (
            <>
              <Box>
                <TextFieldControl
                  //@ts-ignore
                  control={control}
                  name={namePrepend + "decision.percentageDecision.percentage"}
                  label={`Option becomes final result when it has:`}
                  endAdornment={<InputAdornment position="end">% of responses</InputAdornment>}
                  sx={{ width: "300px" }}
                  required
                />
              </Box>
              <Box>
                <TextFieldControl
                  //@ts-ignore
                  control={control}
                  name={namePrepend + "decision.percentageDecision.quorum"}
                  label={`Quorum (min # of responses for a result)`}
                  endAdornment={<InputAdornment position="end">total responses</InputAdornment>}
                  sx={{ width: "300px" }}
                  required
                />
              </Box>
            </>
          ) : (
            <Box>
              <TextFieldControl
                //@ts-ignore
                control={control}
                name={namePrepend + "decision.absoluteDecision.threshold"}
                label={"Option is selected once it has:"}
                sx={{ width: "300px" }}
                endAdornment={<InputAdornment position="end">responses</InputAdornment>}
                required
              />
            </Box>
          )}
        </Box>
      </RolesContainer>
    </>
  );
};

export default RolesAndDecisionSystem;
