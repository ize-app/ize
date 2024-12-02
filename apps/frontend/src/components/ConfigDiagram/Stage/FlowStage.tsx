import Diversity3Outlined from "@mui/icons-material/Diversity3Outlined";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import PlayCircleOutlineOutlined from "@mui/icons-material/PlayCircleOutlineOutlined";
import { Box, SvgIconProps, useTheme } from "@mui/material";

import { actionProperties } from "@/components/Action/actionProperties";
import { AvatarGroup } from "@/components/Avatar";
import { StatusProps } from "@/components/status/statusProps";
import { stringifyValue } from "@/components/Value/stringifyValue";
import {
  ActionFragment,
  ActionType,
  EntityFragment,
  FlowFragment,
  StepFragment,
} from "@/graphql/generated/graphql";
import { colors } from "@/style/style";

import { FlowFormStageInnerContent } from "./FlowStageInnerContent";
import { FlowStageWrapper } from "./FlowStageWrapper";
import { Stage, StagePropsBase } from "./Stage";
import { StageType } from "./StageType";

interface FlowStageTriggerProps extends StagePropsBase {
  type: StageType.Trigger;
  flow: FlowFragment;
}

interface FlowStageStepProps extends StagePropsBase {
  type: StageType.Step;
  step: StepFragment;
}

interface FlowStageActionProps extends StagePropsBase {
  type: StageType.Action;
  action: ActionFragment;
}

interface FlowStageActionFilterProps extends StagePropsBase {
  type: StageType.ActionFilter;
  action: ActionFragment | undefined | null;
}

export type FlowStagePropsBase =
  | FlowStageTriggerProps
  | FlowStageStepProps
  | FlowStageActionProps
  | FlowStageActionFilterProps;

export type FlowStageProps = FlowStagePropsBase & {
  statusProps?: StatusProps;
};

export const FlowStage = ({
  id,
  setSelectedId,
  selectedId,
  statusProps,
  ...props
}: FlowStageProps) => {
  const theme = useTheme();
  let label: string = "";
  let subtitle: string = "";
  let entities: EntityFragment[] = [];
  let icon: React.ComponentType<SvgIconProps> | undefined;

  const color = statusProps?.color ?? theme.palette.primary.main;
  const statusIcon = statusProps?.icon;

  switch (props.type) {
    case StageType.Trigger: {
      const { flow } = props;
      entities = flow.trigger.permission?.entities ?? [];
      label = "Trigger";
      icon = PlayCircleOutlineOutlined;
      break;
    }
    case StageType.Step: {
      const { step } = props;
      label = step.result[0]?.name ?? "Collaborative step";
      subtitle = step.fieldSet.fields[0]?.name ?? "";
      icon = Diversity3Outlined;
      entities = step.response?.permission?.entities ?? [];
      break;
    }
    case StageType.Action: {
      const { action } = props;
      label = action.name;
      icon = actionProperties[action.__typename as ActionType].icon;
      break;
    }
    case StageType.ActionFilter: {
      const { action } = props;
      if (!action?.filter) return null;
      label = stringifyValue({
        value: action.filter.option.value,
      });
      icon = FilterAltIcon;
    }
  }

  return (
    <FlowStageWrapper type={props.type}>
      <Stage
        id={id}
        setSelectedId={setSelectedId}
        selectedId={selectedId}
        icon={icon}
        color={color ?? colors.primary}
        statusIcon={statusIcon}
        size={props.type === StageType.ActionFilter ? "small" : "medium"}
        sx={{
          zIndex: 1,
          minHeight: props.type === StageType.ActionFilter ? "24px" : "48px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexGrow: 1,
          }}
        >
          <FlowFormStageInnerContent
            type={props.type}
            label={label}
            subtitle={subtitle}
            color={color ?? theme.palette.primary.main}
          />
          {entities.length > 0 && <AvatarGroup avatars={entities} />}
        </Box>
      </Stage>
    </FlowStageWrapper>
  );
};
