import Box from "@mui/material/Box";
import { ReactNode } from "react";

const PageContainer = ({ children }: { children: ReactNode }) => (
  <Box sx={{ display: "flex", flexDirection: "column", padding: "6px 12px" }}>{children}</Box>
);

export default PageContainer;
