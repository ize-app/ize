import Box from "@mui/material/Box";
import { SelectChangeEvent } from "@mui/material/Select";
import { ChangeEvent, useState } from "react";

import RequestTable from "./RequestTable";
import { RequestSummaryPartsFragment } from "../../../../graphql/generated/graphql";
import { UserDataProps } from "../../Avatar";
import { Select } from "../../Form/Select";
import Loading from "../../Loading";
import CreateButton from "../CreateButton";
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

export enum FilterOptions {
  Open = "Open",
  Closed = "Closed",
  All = "All",
}

interface RequestTabProps {
  requests: RequestSummaryPartsFragment[];
  loading: boolean;
  defaultFilterOption?: FilterOptions;
  hideCreateButton?: boolean;
  processId?: string;
}

const RequestTab = ({
  requests,
  defaultFilterOption = FilterOptions.Open,
  loading,
  hideCreateButton = false,
  processId,
}: RequestTabProps) => {
  const selectOptions = Object.values(FilterOptions);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectOption, setSelectOption] = useState(defaultFilterOption);

  const filteredRequestData = (requests ?? [])
    .filter((request) => {
      const regExSearchQuery = new RegExp(searchQuery, "i");
      const expirationDate = new Date(request.expirationDate);
      const now = new Date();

      let selectMatch = false;
      let searchMatch = false;

      if (processId && request.process.id !== processId) {
        return false;
      }

      if (selectOption === "All") selectMatch = true;
      else if (selectOption === "Closed" && expirationDate < now)
        selectMatch = true;
      else if (selectOption === "Open" && expirationDate > now)
        selectMatch = true;

      if (request.name.search(regExSearchQuery) !== -1) searchMatch = true;
      else if (request.process.name.search(regExSearchQuery) !== -1)
        searchMatch = true;
      else if (searchForUser(regExSearchQuery, [request.creator]))
        searchMatch = true;

      return selectMatch && searchMatch;
    })
    .sort((a, b) => {
      const now = new Date();

      const aOpen = new Date(Date.parse(a.expirationDate)) > now;
      const bOpen = new Date(Date.parse(b.expirationDate)) > now;

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

  return loading ? (
    <Loading />
  ) : (
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
              changeHandler={(event: ChangeEvent<HTMLInputElement>) => {
                setSearchQuery(event.target.value);
              }}
            />
          </Box>
          <Select
            onChange={(event: SelectChangeEvent) => {
              setSelectOption(event.target.value);
            }}
            selectOptions={selectOptions}
            selectOption={selectOption}
          />
        </Box>
        {hideCreateButton ? null : <CreateButton />}
      </Box>
      <RequestTable requests={filteredRequestData} />
    </Box>
  );
};

export default RequestTab;
