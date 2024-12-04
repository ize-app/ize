import { actionStatusProps } from "@/components/status/actionStatusProps";
import { requestStepStatusProps } from "@/components/status/requestStepStatusProps";
import { StatusProps, genericStatusProps } from "@/components/status/statusProps";
import { ActionStatus, RequestStepStatus, Status } from "@/graphql/generated/graphql";

import { FlowStage, FlowStagePropsBase } from "./FlowStage";
import { StageType } from "./StageType";

type TriggerRequestStageProps = FlowStagePropsBase & {
  type: StageType.Trigger;
  status: undefined;
};

type StepRequestStageProps = FlowStagePropsBase & {
  type: StageType.Step;
  status: RequestStepStatus;
};

type ActionRequestStageProps = FlowStagePropsBase & {
  type: StageType.Action;
  status: ActionStatus;
};

type ActionFilterRequestStageProps = FlowStagePropsBase & {
  type: StageType.ActionFilter;
  status: ActionStatus;
};

type RequestStageProps =
  | TriggerRequestStageProps
  | StepRequestStageProps
  | ActionRequestStageProps
  | ActionFilterRequestStageProps;

export const RequestStage = ({ ...props }: RequestStageProps) => {
  let statusProps: StatusProps;
  switch (props.type) {
    case StageType.Trigger: {
      statusProps = genericStatusProps[Status.Completed];
      break;
    }
    case StageType.Step: {
      statusProps = requestStepStatusProps[props.status];
      break;
    }
    case StageType.Action: {
      statusProps =
        actionStatusProps[
          props.status === ActionStatus.DidNotPassFilter ? ActionStatus.NotStarted : props.status
        ];
      break;
    }
    case StageType.ActionFilter: {
      statusProps = actionStatusProps[props.status];
      break;
    }
  }

  return <FlowStage {...props} statusProps={statusProps} />;
};
