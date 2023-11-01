import { useQuery } from "@apollo/client";
import Box from "@mui/material/Box";
import { ChangeEvent, useState } from "react";

import ProcessTable from "./ProcessTable";
import {
  ProcessSummaryPartsFragment,
  ProcessesDocument,
} from "../../../../graphql/generated/graphql";
import { UserDataProps } from "../../Avatar";
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

const ProcessTab = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const { data, loading, error } = useQuery(ProcessesDocument);

  const processes = (data?.processesForCurrentUser ??
    []) as ProcessSummaryPartsFragment[];

  const filteredRequestData = processes
    .filter((process) => {
      const regExSearchQuery = new RegExp(searchQuery, "i");
      let searchMatch = false;

      if (process.name.search(regExSearchQuery) !== -1) searchMatch = true;
      else if (searchForUser(regExSearchQuery, process.roles.request))
        searchMatch = true;
      else if (searchForUser(regExSearchQuery, process.roles.respond))
        searchMatch = true;
      // else if (searchForUser(regExSearchQuery, [process.roles.edit]))
      //   searchMatch = true;

      return searchMatch;
    })
    .sort();

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
