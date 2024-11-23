import { ActionArgs, ActionType } from "@/graphql/generated/resolver-types";

export const createActionArgsForPolicy = ({
  actionType,
  resultConfigId,
  optionId,
}: {
  actionType: ActionType;
  resultConfigId?: string;
  optionId?: string;
}): ActionArgs | undefined => {
  const actionArgs: ActionArgs = {
    type: actionType,
    filter:
      resultConfigId && optionId
        ? {
            resultConfigId,
            optionId,
          }
        : null,
    locked: true,
  };

  return actionArgs;
};
