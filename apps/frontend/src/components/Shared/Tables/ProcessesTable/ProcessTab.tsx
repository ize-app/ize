import Box from "@mui/material/Box";
import React, { useState } from "react";

import CreateButton from "../CreateButton";
import { processMockData } from "../mockData";
import ProcessTable from "./ProcessTable";
import Search from "../Search";

import { UserDataProps } from "../../Avatar";

const searchForUser = (regExSearchQuery: RegExp, users: UserDataProps[]) => {
  let foundMatch = false;
  for (let i = 0; i < users.length; i++) {
    if (users[i].name.search(regExSearchQuery) !== -1) {
      foundMatch = true;
      break;
    }
  }
  return foundMatch;
};

const ProcessTab = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRequestData = processMockData
    .filter((process) => {
      const regExSearchQuery = new RegExp(searchQuery, "i");
      let searchMatch = false;

      if (process.name.search(regExSearchQuery) !== -1) searchMatch = true;
      else if (searchForUser(regExSearchQuery, process.rights.request))
        searchMatch = true;
      else if (searchForUser(regExSearchQuery, process.rights.respond))
        searchMatch = true;
      else if (searchForUser(regExSearchQuery, process.rights.edit))
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
      <ProcessTable processes={filteredRequestData} />
    </Box>
  );
};

export default ProcessTab;
