import { useQuery } from "@apollo/client";
import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useNewRequestWizardState } from "./newRequestWizard";
import {
  GetProcessesToCreateRequestDocument,
  ProcessSummaryPartsFragment,
} from "../../graphql/generated/graphql";
import { fullUUIDToShort } from "../../utils/inputs";
import Loading from "../shared/Loading";
import Search from "../shared/Tables/Search";
import { WizardBody } from "../shared/Wizard";

export const SelectProcess = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const { setParams } = useNewRequestWizardState();

  const { data, loading } = useQuery(GetProcessesToCreateRequestDocument, {
    variables: {
      // TODO replace with actual groups
      groups: [],
    },
  });

  const processes = (data?.processesForCurrentUser ?? []) as ProcessSummaryPartsFragment[];

  const filteredProcesses = processes.filter((process) => {
    const regExSearchQuery = new RegExp(searchQuery, "i");
    return process.name.search(regExSearchQuery) !== -1;
  });

  return loading ? (
    <Loading />
  ) : (
    <WizardBody>
      {" "}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: "16px",
          width: "100%",
          maxWidth: "500px",
          marginBottom: "16px",
        }}
      >
        <Search
          searchQuery={searchQuery}
          changeHandler={(event: React.ChangeEvent<HTMLInputElement>) => {
            setSearchQuery(event.target.value);
          }}
        />
      </Box>
      <TableContainer component={Paper} sx={{ overflowX: "initial", maxWidth: "800px" }}>
        <Table
          aria-label="table"
          stickyHeader={true}
          sx={{
            "& .MuiTableRow-root:hover": {
              backgroundColor: "primary.light",
            },
            "& .MuiTableCell-root:hover": {
              color: "white",
            },
          }}
        >
          <TableBody>
            {filteredProcesses.map((process) => (
              <TableRow
                key={process.id}
                onClick={() => {
                  setParams({ processId: fullUUIDToShort(process.id) });
                  navigate(fullUUIDToShort(process.id));
                }}
              >
                <TableCell>
                  <Typography fontWeight={500}>{process.name}</Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </WizardBody>
  );
};
