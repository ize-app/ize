import { zodResolver } from "@hookform/resolvers/zod";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { SnackbarContext } from "../../../contexts/SnackbarContext";
import { RadioControl } from "../Form";

const formSchema = z.object({
  option: z.string().trim().nonempty("Please select an option"),
});

type FormFields = z.infer<typeof formSchema>;

export const SubmitResponse = ({
  options,
  onSubmit,
  displayAsColumn,
}: {
  options: string[];
  onSubmit: () => void;
  displayAsColumn: boolean;
}) => {
  const { setSnackbarOpen, setSnackbarData } = useContext(SnackbarContext);

  const submitSideEffects = () => {
    setSnackbarData({ message: "Response submitted!" });
    setSnackbarOpen(true);
    onSubmit();
  };

  const { control, handleSubmit } = useForm<FormFields>({
    defaultValues: {
      option: "",
    },
    resolver: zodResolver(formSchema),
    shouldUnregister: true,
  });

  return (
    <Box
      component={"form"}
      sx={(theme) => ({
        display: "flex",
        padding: "16px",
        flexDirection: displayAsColumn ? "column" : "row",
        justifyContent: "space-between",
        alignItems: "center",
        alignSelf: "stretch",
        [theme.breakpoints.down("sm")]: {
          flexDirection: "column",
        },
      })}
    >
      <Box sx={{ width: "100%", height: "100%" }}>
        <RadioControl
          name="option"
          //@ts-ignore
          control={control}
          sx={{ flexDirection: "column", gap: "4px" }}
          options={options.map((option) => ({ label: option, value: option }))}
        />
      </Box>

      <Box
        sx={{
          minWidth: "120px",
          height: "100%",
          padding: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Button variant="contained" onClick={handleSubmit(submitSideEffects)}>
          Submit
        </Button>
      </Box>
    </Box>
  );
};
