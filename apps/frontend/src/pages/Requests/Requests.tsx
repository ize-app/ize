import Typography from "@mui/material/Typography";

import { GroupInvitations } from "@/components/GroupInvitations/GroupInivitations";
import { InfoBannersContainer } from "@/components/InfoBanner/InfoBannersContainer";
import { FlowWatchFilter } from "@/graphql/generated/graphql";
import Head from "@/layout/Head";
import PageContainer from "@/layout/PageContainer";

import { RequestSearch } from "./RequestsSearch";

export const Requests = () => {
  return (
    <PageContainer>
      <Head
        title={"Dashboard"}
        description={"View and trigger requests for your collaborative workflows."}
      />
      <Typography variant="h1">Inbox</Typography>
      <InfoBannersContainer>
        <GroupInvitations />
      </InfoBannersContainer>
      <RequestSearch
        initialFlowWatchFilter={FlowWatchFilter.WatchedByMeOrMyGroups}
        initialNeedsResponseFilter={true}
      />
    </PageContainer>
  );
};
