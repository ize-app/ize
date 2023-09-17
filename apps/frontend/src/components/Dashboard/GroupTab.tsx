import Box from "@mui/material/Box";
import React, { useState } from "react";

import CreateButton from "./CreateButton";
import { groupMockData } from "./mockData";
import GroupTable from "./GroupTable";
import Search from "./Search";

const GroupTab = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredGroupData = groupMockData
    .filter((group) => {
      const regExSearchQuery = new RegExp(searchQuery, "i");
      let searchMatch = false;

      if (group.name.search(regExSearchQuery) !== -1) searchMatch = true;
      else if (group.parentGroup?.name.search(regExSearchQuery) !== -1)
        searchMatch = true;

      return searchMatch;
    })
    .sort();

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
            changeHandler={(event: React.ChangeEvent<HTMLInputElement>) => {
              setSearchQuery(event.target.value);
            }}
          />
        </Box>
        <CreateButton />
      </Box>
      <GroupTable groups={filteredGroupData} />
    </Box>
  );
};

export default GroupTab;
