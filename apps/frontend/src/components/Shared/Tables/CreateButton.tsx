import Add from "@mui/icons-material/Add";
import Button from "@mui/material/Button";

const CreateButton = (): JSX.Element => (
  <Button
    sx={{
      borderRadius: "100px",
      border: "1px solid",
      height: "40px",
      width: "40px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minWidth: "40px",
      backgroundColor: "primary.main",
      color: "white",
      "&&:hover": {
        backgroundColor: "#B69DF8",
      },
    }}
    onClick={() => {
      console.log("clicked!");
    }}
  >
    <Add />
  </Button>
);

export default CreateButton;
