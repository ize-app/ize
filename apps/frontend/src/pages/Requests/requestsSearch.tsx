import { RequestStepSummaryFragment } from "@/graphql/generated/graphql";

export const filterRequests = ({
  requestSteps,
  searchQuery,
}: {
  requestSteps: RequestStepSummaryFragment[];
  searchQuery: string;
}) =>
  requestSteps
    .filter((rs) => {
      const regExSearchQuery = new RegExp(searchQuery, "i");
      let searchMatch = false;

      if (rs.requestName.search(regExSearchQuery) !== -1) searchMatch = true;
      if (rs.flowName.search(regExSearchQuery) !== -1) searchMatch = true;

      return searchMatch;
    })
    .sort();
