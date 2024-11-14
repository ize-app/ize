import { WarningOutlined } from "@mui/icons-material";
import Diversity3OutlinedIcon from "@mui/icons-material/Diversity3Outlined";
import PlayCircleOutlineOutlinedIcon from "@mui/icons-material/PlayCircleOutlineOutlined";
import { Box, SvgIconProps, Typography } from "@mui/material";
import { useFieldArray, useFormContext } from "react-hook-form";

import { actionProperties } from "@/components/Action/actionProperties";
import { StageMenu } from "@/components/ConfigDiagram";
import { Stage, StageProps } from "@/components/ConfigDiagram/DiagramPanel/Stage";
import { ActionType } from "@/graphql/generated/graphql";
import { colors } from "@/style/style";

import { FlowSchemaType } from "../formValidation/flow";
import { defaultStepFormValues } from "../helpers/getDefaultFormValues";
import { getResultFormLabel } from "../helpers/getResultFormLabel";

interface FlowStageTriggerProps extends StageProps {
  type: "trigger";
}

interface FlowStageStepProps extends StageProps {
  type: "step";
  stepsArrayMethods: ReturnType<typeof useFieldArray>;
  index: number;
}

interface FlowStageActionProps extends StageProps {
  type: "action";
  index: number;
}

type FlowStageProps = FlowStageTriggerProps | FlowStageStepProps | FlowStageActionProps;

export const FlowFormStage = ({
  id,
  setSelectedId,
  selectedId,
  sx = {},
  ...args
}: FlowStageProps) => {
  const { formState, getValues, setValue } = useFormContext<FlowSchemaType>();
  let icon: React.ComponentType<SvgIconProps> | undefined;
  let label: string = "";
  let subtitle: string = "";
  let disableDelete: boolean = false;
  let hasError: boolean = false;
  let deleteHandler: () => void = () => {};

  switch (args.type) {
    case "trigger": {
      label = "Trigger";
      disableDelete = true;
      hasError = !!formState.errors.fieldSet || !!formState.errors.trigger;
      icon = PlayCircleOutlineOutlinedIcon;
      break;
    }
    case "step": {
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
    case "action": {
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
  }

  const isSelected = selectedId === id;
  return (
    <Stage
      id={id}
      setSelectedId={setSelectedId}
      selectedId={selectedId}
      icon={icon}
      color={hasError ? colors.error : colors.primary}
      statusIcon={hasError ? WarningOutlined : undefined}
      sx={{
        borderColor: hasError ? colors.error : isSelected ? colors.primary : "rgba(0, 0, 0, 0.1)", // TODO check this actually makes sense
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
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
          }}
        >
          <Typography variant="label">{label}</Typography>
          {subtitle && (
            <Typography fontSize={".7rem"} lineHeight={"1rem"} width={"100%"}>
              {subtitle}
            </Typography>
          )}
        </Box>
        {/* {entities.length > 0 && <AvatarGroup avatars={entities} />} */}
        {deleteHandler && !disableDelete && <StageMenu deleteHandler={deleteHandler} />}
      </Box>
    </Stage>
  );
};
