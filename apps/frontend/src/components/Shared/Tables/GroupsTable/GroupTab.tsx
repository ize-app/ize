import Box from "@mui/material/Box";
import { ChangeEvent, useState } from "react";

import GroupTable from "./GroupTable";
import { GroupSummaryPartsFragment } from "../../../../graphql/generated/graphql";
import Loading from "../../Loading";
import CreateButton from "../CreateButton";
import Search from "../Search";

const GroupTab = ({
  groups,
  loading,
}: {
  groups: GroupSummaryPartsFragment[];
  loading: boolean;
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredGroupData = groups?.filter((group) => {
    const regExSearchQuery = new RegExp(searchQuery, "i");
    return group.name.search(regExSearchQuery) !== -1;
  });
  // .sort();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "30px",
      }}
    >
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          flexDirection: "row",
          gap: "16px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: "16px",
            width: "100%",
            maxWidth: "500px",
          }}
        >
          <Search
            searchQuery={searchQuery}
            changeHandler={(event: ChangeEvent<HTMLInputElement>) => {
              setSearchQuery(event.target.value);
            }}
          />
        </Box>
        <CreateButton />
      </Box>
      {loading ? <Loading /> : <GroupTable groups={filteredGroupData} />}
    </Box>
  );
};

export default GroupTab;
