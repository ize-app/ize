import { statusProps } from "@/components/status/statusProps";
import { Status } from "@/graphql/generated/graphql";

import { FlowStage, FlowStageProps } from "../ConfigDiagramFlow/FlowStage";

type RequestStageProps = FlowStageProps & {
  status: Status;
};

export const RequestStage = ({ status, ...props }: RequestStageProps) => {
  const backgroundColor = statusProps[status].backgroundColor;
  const statusIcon = statusProps[status].icon;

  return <FlowStage {...props} statusIcon={statusIcon} color={backgroundColor} />;
};
