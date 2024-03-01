import { Option, Step } from "@/graphql/generated/resolver-types";
import { StepPrismaType } from "../flowPrismaTypes";
import { permissionResolver } from "../../permission/resolvers";
import { fieldSetResolver } from "../../fields/resolvers/fieldSetResolver";
import { actionResolver } from "../../action/resolvers";
import { resultConfigResolver } from "../../result/resolvers";
import { hasReadPermission } from "../../permission/hasReadPermission";

export const stepResolver = ({
  step,
  userIdentityIds,
  userGroupIds,
  userId,
}: {
  step: StepPrismaType;
  userIdentityIds: string[];
  userGroupIds: string[];
  userId: string | undefined;
}): Step => {
  let responseOptions: Option[] | undefined = undefined;

  const responseFields = step.ResponseFieldSet
    ? fieldSetResolver({ fieldSet: step.ResponseFieldSet })
    : null;
  if (responseFields && responseFields[0].__typename === "Options") {
    responseOptions = responseFields[0].options as Option[];
  }
  return {
    request: {
      permission: permissionResolver(step.RequestPermissions, userIdentityIds),
      fields: fieldSetResolver({ fieldSet: step.RequestFieldSet }),
    },
    response: {
      permission: permissionResolver(step.ResponsePermissions, userIdentityIds),
      fields: fieldSetResolver({ fieldSet: step.ResponseFieldSet }),
    },
    action: step.ActionNew ? actionResolver(step.ActionNew, responseOptions) : null,
    result: resultConfigResolver(step.ResultConfig, responseOptions),
    expirationSeconds: step.expirationSeconds,
    userPermission: {
      request: hasReadPermission(step.RequestPermissions, userIdentityIds, userGroupIds, userId),
      response: hasReadPermission(step.ResponsePermissions, userIdentityIds, userGroupIds, userId),
    },
  };
};
