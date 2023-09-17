import React, { useState } from "react";

import Box from "@mui/material/Box";
import { SelectChangeEvent } from "@mui/material/Select";

import CreateButton from "./CreateButton";
import { requestMockData } from "./mockData";
import RequestTable from "./RequestTable";
import Search from "./Search";
import Select from "./Select";
import { UserDataProps } from "../shared/Avatar";

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

const RequestTab = () => {
  const selectOptions = ["Open", "Closed", "All"];

  const [searchQuery, setSearchQuery] = useState("");
  const [selectOption, setSelectOption] = useState(selectOptions[0]);

  const filteredRequestData = requestMockData
    .filter((request) => {
      const regExSearchQuery = new RegExp(searchQuery, "i");
      const expirationDate = new Date(request.expirationDate);
      const now = new Date();

      let selectMatch = false;
      let searchMatch = false;

      if (selectOption === "All") selectMatch = true;
      else if (selectOption === "Closed" && expirationDate < now)
        selectMatch = true;
      else if (selectOption === "Open" && expirationDate > now)
        selectMatch = true;

      if (request.request.search(regExSearchQuery) !== -1) searchMatch = true;
      else if (request.process.search(regExSearchQuery) !== -1)
        searchMatch = true;
      else if (searchForUser(regExSearchQuery, request.creator))
        searchMatch = true;

      return selectMatch && searchMatch;
    })
    .sort((a, b) => {
      const now = new Date();

      const aOpen = a.expirationDate > now;
      const bOpen = b.expirationDate > now;

      if (aOpen && !bOpen) return -1;
      else if (!aOpen && bOpen) return 1;
      else if (aOpen && bOpen) {
        if (a.expirationDate < b.expirationDate) return -1;
        else return 1;
      } else {
        if (a.expirationDate < b.expirationDate) return 1;
        else return -1;
      }
    });

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
          }}
        >
          <Box sx={{ maxWidth: "250px", width: "100%" }}>
            <Search
              searchQuery={searchQuery}
              changeHandler={(event: React.ChangeEvent<HTMLInputElement>) => {
                setSearchQuery(event.target.value);
              }}
            />
          </Box>
          <Select
            changeHandler={(event: SelectChangeEvent) => {
              setSelectOption(event.target.value);
            }}
            selectOptions={["Open", "Closed", "All"]}
            selectOption={selectOption}
          />
        </Box>
        <CreateButton />
      </Box>
      <RequestTable requests={filteredRequestData} />
    </Box>
  );
};

export default RequestTab;
