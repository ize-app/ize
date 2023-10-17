import Box from "@mui/material/Box";
import React, { useState } from "react";

import CreateButton from "../CreateButton";
import GroupTable from "./GroupTable";
import Search from "../Search";
import { useQuery } from "@apollo/client";
import { GroupsDocument } from "../../../../graphql/generated/graphql";
import { LinearProgress } from "@mui/material";

const GroupTab = () => {
  const { data, loading } = useQuery(GroupsDocument);
  const [searchQuery, setSearchQuery] = useState("");

  const groupData = data?.groupsForCurrentUser;

  const filteredGroupData =
    groupData
      ?.filter((group) => {
        const regExSearchQuery = new RegExp(searchQuery, "i");
        return group.name.search(regExSearchQuery) !== -1;
      })
      .sort() ?? [];

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
      {loading ? <LinearProgress /> : <GroupTable groups={filteredGroupData} />}
    </Box>
  );
};

export default GroupTab;
