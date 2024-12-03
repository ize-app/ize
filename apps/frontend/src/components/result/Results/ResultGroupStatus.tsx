import { Box, SvgIcon, Typography } from "@mui/material";

import { resultGroupStatusProps } from "@/components/status/resultGroupStatusProps";
import { ResultGroupStatus, ResultType } from "@/graphql/generated/graphql";

export const ResultGroupStatusDisplay = ({
  status,
  resultType,
}: {
  status: ResultGroupStatus | undefined;
  resultType?: ResultType;
}) => {
  const statusProps = resultGroupStatusProps[status ?? ResultGroupStatus.NotStarted];
  const icon = statusProps.icon ? (
    <Box sx={{ marginRight: "12px", display: "flex" }}>
      <SvgIcon component={statusProps.icon} style={{ color: statusProps.color }} />
    </Box>
  ) : null;

  const resultName = resultType === ResultType.Decision ? "decision" : "result";

  let title: string;
  switch (status) {
    case ResultGroupStatus.Attempting:
      title = `Creating ${resultName}`;
      break;
    case ResultGroupStatus.Error:
      title = `Error creating final ${resultName}`;
      break;
    case ResultGroupStatus.FinalNoResult:
      title = `No final ${resultName}`;
      break;
    default:
      return null;
  }
  return (
    <Box sx={{ display: "flex", flexDirection: "row", gap: "8px", alignItems: "center" }}>
      {icon}
      <Typography variant="description" color={statusProps.color}>
        {title}
      </Typography>
    </Box>
  );
};
