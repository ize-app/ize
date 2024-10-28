import Box from "@mui/material/Box";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
      style={{ height: "100%" }}
    >
      <Box sx={{ paddingTop: "12px", height: "100%" }} display={value === index ? "block" : "none"}>
        {children}
      </Box>
    </div>
  );
}

export default TabPanel;
