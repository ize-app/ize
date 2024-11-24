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

    if (currentStepLength === 0) {
      stepsArrayMethods.append(getDefaultStepFormValues());
    }
    // there will usually be a first step, but sometimes that step is just an action (no response) and other times it actually has a response
    else if (currentStepLength === 1 && positionIndex === 0) {
      // if there's a response, insert a new step
      if (getValues(`steps.${0}.response`)) {
        const newStep = {
          ...getDefaultStepFormValues(),
          action: { filterOptionId: null, type: ActionType.TriggerStep, locked: false },
        };
        stepsArrayMethods.prepend(newStep);
      }
      // if no response, overwrite step 0 to have a response config
      // this will allow it display in the UI as a collaborative step
      // this will also preserve any previously created actions, if there is one
      else {
        setValue(`steps.${0}.response`, getDefaultStepFormValues().response);
      }
    }
    // if adding the final step in the array
    else if (positionIndex === currentFinalStepIndex + 1) {
      const newStep = getDefaultStepFormValues();
      // copy over final action to new final step
      newStep.action = getValues(`steps.${currentFinalStepIndex}.action`);
      stepsArrayMethods.append(newStep);
      // change previous final step to have a trigger action
      setValue(`steps.${currentFinalStepIndex}.action`, {
        filter: undefined,
        type: ActionType.TriggerStep,
        locked: false,
      });
    }
    // if inserting step anywhere els
    else {
      stepsArrayMethods.insert(positionIndex, getDefaultStepFormValues());
      setValue(`steps.${currentFinalStepIndex}.action`, {
        filter: undefined,
        type: ActionType.TriggerStep,
        locked: false,
      });
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
    // const options = getActionFilterResultOptions({
    //   results: previousStep.result,
    //   responseFields: previousStep.fieldSet.fields,
    // });
    // const defaultOptionFilterId = options[0].value as string;
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
