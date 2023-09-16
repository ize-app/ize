import Box from "@mui/material/Box";
import { SelectChangeEvent } from "@mui/material/Select";
import React, { useState } from "react";

import RequestTable from "./RequestTable";
import CreateButton from "./CreateButton";
import Search from "./Search";
import Select from "./Select";

const RequestTab = () => {
  const selectOptions = ["Open", "Closed", "All"];

  const [searchQuery, setSearchQuery] = useState("");
  const [selectOption, setSelectOption] = useState(selectOptions[0]);

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
      <RequestTable />
    </Box>
  );
};

export default RequestTab;
