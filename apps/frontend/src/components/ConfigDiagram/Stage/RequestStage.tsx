import { useTheme } from "@mui/material";

import { statusProps } from "@/components/status/statusProps";
import { Status } from "@/graphql/generated/graphql";

import { FlowStage, FlowStageProps } from "./FlowStage";

type RequestStageProps = FlowStageProps & {
  status: Status | undefined;
};

export const RequestStage = ({ status, ...props }: RequestStageProps) => {
  const theme = useTheme();
  const backgroundColor = status ? statusProps[status].backgroundColor : theme.palette.primary.main;
  const statusIcon = status && statusProps[status].icon;

  return <FlowStage {...props} statusIcon={statusIcon} color={backgroundColor} />;
};
