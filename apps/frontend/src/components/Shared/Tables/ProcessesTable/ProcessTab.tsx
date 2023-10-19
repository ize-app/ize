import Box from "@mui/material/Box";
import { ChangeEvent, useState } from "react";

import ProcessTable from "./ProcessTable";
import { UserDataProps } from "../../Avatar";
import CreateButton from "../CreateButton";
import { processMockData } from "../mockData";
import Search from "../Search";

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
      else if (searchForUser(regExSearchQuery, process.roles.request))
        searchMatch = true;
      else if (searchForUser(regExSearchQuery, process.roles.respond))
        searchMatch = true;
      else if (searchForUser(regExSearchQuery, [process.roles.edit]))
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
            changeHandler={(event: ChangeEvent<HTMLInputElement>) => {
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
