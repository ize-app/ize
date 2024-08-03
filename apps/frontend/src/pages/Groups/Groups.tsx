import Typography from "@mui/material/Typography";

import Head from "@/layout/Head";
import PageContainer from "@/layout/PageContainer";

import { GroupsSearch } from "./GroupsSearch";

export const Groups = () => {
  return (
    <PageContainer>
      <Head title={"Groups"} description={"Your watched groups"} />
      <Typography variant="h1">Groups</Typography>
      <GroupsSearch />
    </PageContainer>
  );
};
