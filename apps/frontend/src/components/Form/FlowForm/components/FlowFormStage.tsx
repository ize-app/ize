import { WarningOutlined } from "@mui/icons-material";
import Diversity3OutlinedIcon from "@mui/icons-material/Diversity3Outlined";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import PlayCircleOutlineOutlinedIcon from "@mui/icons-material/PlayCircleOutlineOutlined";
import { Box, SvgIconProps, useTheme } from "@mui/material";
import { useFieldArray, useFormContext } from "react-hook-form";

import { actionProperties } from "@/components/Action/actionProperties";
import { StageMenu } from "@/components/ConfigDiagram";
import { FlowFormStageInnerContent } from "@/components/ConfigDiagram/Stage/FlowStageInnerContent";
import { FlowStageWrapper } from "@/components/ConfigDiagram/Stage/FlowStageWrapper";
import { Stage, StageProps } from "@/components/ConfigDiagram/Stage/Stage";
import { StageType } from "@/components/ConfigDiagram/Stage/StageType";
import { ActionType } from "@/graphql/generated/graphql";

import { getSelectOptionName } from "../../utils/getSelectOptionName";
import { FlowSchemaType } from "../formValidation/flow";
import { getActionFilterOptions } from "../helpers/getActionFilterOptions";
import { defaultStepFormValues } from "../helpers/getDefaultFormValues";
import { getResultFormLabel } from "../helpers/getResultFormLabel";

interface FlowStageTriggerProps extends StageProps {
  type: StageType.Trigger;
}

interface FlowStageStepProps extends StageProps {
  type: StageType.Step;
  stepsArrayMethods: ReturnType<typeof useFieldArray>;
  index: number;
}

interface FlowStageActionProps extends StageProps {
  type: StageType.Action;
  index: number;
}

interface FlowStageActionFilterProps extends StageProps {
  type: StageType.ActionFilter;
  index: number;
}

type FlowStageProps =
  | FlowStageTriggerProps
  | FlowStageStepProps
  | FlowStageActionProps
  | FlowStageActionFilterProps;

export const FlowFormStage = ({
  id,
  setSelectedId,
  selectedId,
  sx = {},
  ...args
}: FlowStageProps) => {
  const { formState, getValues, setValue } = useFormContext<FlowSchemaType>();
  const theme = useTheme();
  let icon: React.ComponentType<SvgIconProps> | undefined;
  let label: string = "";
  let subtitle: string = "";
  let disableDelete: boolean = false;
  let hasError: boolean = false;
  let deleteHandler: () => void = () => {};

  switch (args.type) {
    case StageType.Trigger: {
      label = "Trigger";
      disableDelete = true;
      hasError = !!formState.errors.fieldSet || !!formState.errors.trigger;
      icon = PlayCircleOutlineOutlinedIcon;
      break;
    }
    case StageType.Step: {
      const { index, stepsArrayMethods } = args;
      const step = getValues(`steps.${index}`);
      label = getResultFormLabel({ result: step.result[0] });
      subtitle = step.fieldSet.fields[0]?.name;
      disableDelete = step.fieldSet.locked;
      hasError = !!formState.errors.steps?.[index];
      icon = Diversity3OutlinedIcon;
      deleteHandler = () => {
        const isFinalStep = index === stepsArrayMethods.fields.length - 1;
        // note: setSelectedId is not working right now. issue is with how deleteHandler is passed to child components
        // Set the selected ID to the previous step before deleting
        setSelectedId(`trigger0`);
        if (index === 0 && stepsArrayMethods.fields.length === 1) {
          //if only one step, then reset response/result/fieldset fields
          const currentStepVal = getValues(`steps.${0}`);
          setValue(`steps.${0}`, {
            ...currentStepVal,
            response: undefined,
            result: defaultStepFormValues.result,
            fieldSet: defaultStepFormValues.fieldSet,
          });
        } else if (isFinalStep) {
          // if there are more then one steps, copy the action from the current final step to the new final step
          setValue(`steps.${index - 1}.action`, getValues(`steps.${index}.action`));

          //then remove the step
          stepsArrayMethods.remove(index);
        } else {
          stepsArrayMethods.remove(index);
        }
      };
      break;
    }
    case StageType.Action: {
      const { index } = args;
      const action = getValues(`steps.${index}.action`);
      const displayAction =
        action && action.type && action.type !== ActionType.TriggerStep ? true : false;
      if (!action || !displayAction) return null;

      icon = actionProperties[action.type].icon;
      disableDelete = action.locked;
      label = actionProperties[action.type].label;
      hasError = !!formState.errors.steps?.[index]?.action;
      deleteHandler = () => {
        // note: setSelectedId is not working right now. issue is with how deleteHandler is passed to child components
        setSelectedId("trigger0");
        setValue(`steps.${index}.action`, undefined);
      };
      break;
    }
    case StageType.ActionFilter: {
      const { index } = args;
      const action = getValues(`steps.${index}.action`);
      const results = getValues(`steps.${index}.result`);
      const responseFields = getValues(`steps.${index}.fieldSet.fields`);
      if (!action || !action.filterOptionId) return null;
      const filterOptions = getActionFilterOptions({
        results,
        responseFields,
        optionNameOnly: true,
      });
      icon = FilterAltIcon;
      label = getSelectOptionName(filterOptions, action.filterOptionId) as string;
      deleteHandler = () => {
        // note: setSelectedId is not working right now. issue is with how deleteHandler is passed to child components
        setSelectedId("trigger0");
        setValue(`steps.${index}.action.filterOptionId`, null);
      };
      break;
    }
  }

  const isSelected = selectedId === id;

  return (
    <FlowStageWrapper type={args.type}>
      <Stage
        id={id}
        setSelectedId={setSelectedId}
        selectedId={selectedId}
        icon={icon}
        size={args.type === StageType.ActionFilter ? "small" : "medium"}
        color={hasError ? theme.palette.error.main : theme.palette.error.main}
        statusIcon={hasError ? WarningOutlined : undefined}
        sx={{
          zIndex: 1,
          minHeight: args.type === StageType.ActionFilter ? "24px" : "48px",
          borderColor: hasError
            ? theme.palette.error.main
            : isSelected
              ? theme.palette.primary.main
              : "rgba(0, 0, 0, 0.1)", // TODO check this actually makes sense
          ...sx,
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
            type={args.type}
            label={label}
            subtitle={subtitle}
            color={theme.palette.primary.main}
          />
          {/* {entities.length > 0 && <AvatarGroup avatars={entities} />} */}
          {deleteHandler && !disableDelete && <StageMenu deleteHandler={deleteHandler} />}
        </Box>
      </Stage>
    </FlowStageWrapper>
  );
};
