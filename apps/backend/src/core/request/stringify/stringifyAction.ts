import { Action } from "@/graphql/generated/resolver-types";

export const stringifyAction = ({ action }: { action: Action | undefined }): string => {
  if (!action) return "";
  else return action.name;
};
