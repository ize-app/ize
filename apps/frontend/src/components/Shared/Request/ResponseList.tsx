import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow, { tableRowClasses } from "@mui/material/TableRow";

import { AgentType, Response } from "../../../graphql/generated/graphql";
import { AvatarWithName } from "../Avatar";

const ResponseListRow = ({ response }: { response: Response }) => {
  return (
    <TableRow>
      <TableCell>
        <AvatarWithName
          id={response.user.id}
          type={AgentType.User}
          avatarUrl={response.user.icon}
          name={response.user.name}
        />
      </TableCell>
      <TableCell>{response.value}</TableCell>
    </TableRow>
  );
};

export const ResponseList = ({ responses }: { responses: Response[] }) => {
  return (
    <TableContainer
      sx={{
        overflowX: "initial",
        [`& :last-of-type.${tableRowClasses.root}`]: {
          [`& .${tableCellClasses.root}`]: {
            borderBottom: "none",
          },
        },
      }}
    >
      <Table aria-label="collapsible table" size={"medium"}>
        <TableBody>
          {responses.map((response, index) => (
            <ResponseListRow
              response={response}
              key={"response" + index.toString()}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
