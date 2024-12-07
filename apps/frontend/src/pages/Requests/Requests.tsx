import Typography from "@mui/material/Typography";

import { GroupInvitations } from "@/components/GroupInvitations/GroupInivitations";
import { FlowWatchFilter } from "@/graphql/generated/graphql";
import Head from "@/layout/Head";
import PageContainer from "@/layout/PageContainer";

import { RequestSearch } from "./RequestsSearch";

export const Requests = () => {
  return (
    <PageContainer>
      <Head
        title={"Requests"}
        description={"View and trigger requests for your collaborative workflows."}
      />
      <Typography variant="h1">Requests</Typography>
      <GroupInvitations />
      <RequestSearch initialFlowWatchFilter={FlowWatchFilter.WatchedByMeOrMyGroups} />
    </PageContainer>
  );
};
