import { AgentSummaryPartsFragment } from "@/graphql/generated/graphql";

export const hasPermission = (
  userId: string | undefined,
  groupIds: string[] | undefined,
  processRoles: AgentSummaryPartsFragment[] | undefined,
) => {
  // console.log("evaluating user,", userId, "groupIds", groupIds, "processRoles", processRoles);
  if (!userId || !processRoles) return false;
  return processRoles.some((role) => {
    if (role.id === userId) return true;
    if ((groupIds ?? []).some((groupId) => groupId === role.id)) return true;
    return false;
  });
};
