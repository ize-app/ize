import AddIcon from "@mui/icons-material/Add";
import { Menu, MenuItem } from "@mui/material";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { Dispatch, SetStateAction, useCallback, useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

import { ActionType, ResultType } from "@/graphql/generated/graphql";

import { FlowSchemaType } from "../formValidation/flow";
import { getDefaultStepFormValues } from "../helpers/getDefaultFormValues";
// position Index is position of new step in the array
export const AddStepButton = ({
  positionIndex,
  stepsArrayMethods,
  setSelectedId,
}: {
  positionIndex: number;
  stepsArrayMethods: ReturnType<typeof useFieldArray>;
  setSelectedId: Dispatch<SetStateAction<string | false>>;
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const { getValues, setValue } = useFormContext<FlowSchemaType>();

  const previousStep = getValues(`steps.${positionIndex - 1}`);

  // isEnd means that this add button is at end of steps array and also has no action after it
  const isEnd = positionIndex > stepsArrayMethods.fields.length - 1 && !previousStep?.action;

  const hasDecisionToFilterBy: boolean = (previousStep?.result ?? []).some(
    (result) => result.type === ResultType.Decision,
  );

  const hasAction = !!previousStep?.action;

  const alreadyHasFilter = !!previousStep?.action?.filter;

  const addStepHandler = useCallback(() => {
    const currentStepLength = stepsArrayMethods.fields.length;
    const currentFinalStepIndex = Math.max(stepsArrayMethods.fields.length - 1, 0);

    const newStep = getDefaultStepFormValues();

    // if there's one step but it doesn't have a response, reset field but copy over action
    if (currentStepLength === 1 && !!getValues(`steps.${0}.response`)) {
      const currentAction = getValues(`steps.${0}.action`);
      setValue(`steps.${0}`, { ...newStep, action: currentAction });
    } else {
      // if adding to the end of the array, copy current final action to new final step
      if (positionIndex === currentFinalStepIndex + 1) {
        const currentFinalAction = (newStep.action = getValues(
          `steps.${currentFinalStepIndex}.action`,
        ));
        newStep.action = currentFinalAction;
      }

      // set prior step to point to new step
      if (positionIndex > 0) {
        setValue(`steps.${positionIndex - 1}.action`, {
          filter: undefined,
          stepId: newStep.stepId,
          type: ActionType.TriggerStep,
          locked: false,
        });
      }
      // point new step to the step after it
      if (positionIndex <= currentFinalStepIndex) {
        const newNextStep = getValues(`steps.${positionIndex}`);
        newStep.action = {
          filter: undefined,
          stepId: newNextStep.stepId,
          type: ActionType.TriggerStep,
          locked: false,
        };
      }

      // finally insert the new step
      stepsArrayMethods.insert(positionIndex, newStep);
    }
    setSelectedId(`step${positionIndex}`);
  }, [positionIndex, setSelectedId, stepsArrayMethods, setValue, getValues]);

  const addWebhookHandler = () => {
    setValue(`steps.${stepsArrayMethods.fields.length - 1}.action`, {
      filter: undefined,
      type: ActionType.CallWebhook,
      locked: false,
      callWebhook: { uri: "", name: "", valid: false },
    });
    setSelectedId("webhook");
  };

  const addFilterHandler = () => {
    setValue(`steps.${positionIndex - 1}.action.filter`, { optionId: "", resultConfigId: "" });
    setSelectedId(`actionFilter${positionIndex - 1}`);
  };

  return (
    <Box sx={{ height: "48px", position: "relative", display: "flex", alignItems: "center" }}>
      <Box
        sx={(theme) => ({
          position: "absolute",
          height: isEnd ? "50%" : "100%",
          width: "1px",
          backgroundColor: theme.palette.grey[500],
          left: "50%",
          transform: "translateX(-50%)",
          top: 0,
        })}
      />
      <IconButton
        onClick={(e) => {
          handleMenuOpen(e);
        }}
        size="small"
      >
        <AddIcon
          fontSize="small"
          color={"primary"}
          sx={(theme) => ({
            borderRadius: "100px",
            border: `1px solid ${theme.palette.grey[500]}`,
            backgroundColor: "#fffbff",
          })}
        />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        autoFocus={false}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem
          onClick={() => {
            addStepHandler();
            handleClose();
          }}
        >
          Add collaborative step
        </MenuItem>
        {isEnd && (
          <MenuItem
            onClick={() => {
              addWebhookHandler();
              handleClose();
            }}
          >
            Trigger a webhook
          </MenuItem>
        )}
        {positionIndex > 0 && !alreadyHasFilter && (
          <MenuItem
            disabled={!hasDecisionToFilterBy || !hasAction}
            onClick={() => {
              addFilterHandler();
              handleClose();
            }}
          >
            Filter by decision
          </MenuItem>
        )}
      </Menu>
    </Box>
  );
};
