import { ActionFragment } from "@/graphql/generated/graphql";
import { actionProperties } from "./actionProperties";

export const getActionLabel = (action: ActionFragment) => {
  if (action.__typename === "CallWebhook") {
    return action.name + "sdfasdfasasdfasdfasdfdf";
  } else return actionProperties[action.__typename].label;
};
