import Typography from "@mui/material/Typography";

import Head from "@/layout/Head";
import PageContainer from "@/layout/PageContainer";

export const Groups = () => {
  return (
    <PageContainer>
      <Head title={"Groups"} description={"Your watched groups"} />
      <Typography variant="h1">Groups</Typography>
      {/* <RequestStepsSearch userOnly /> */}
    </PageContainer>
  );
};
