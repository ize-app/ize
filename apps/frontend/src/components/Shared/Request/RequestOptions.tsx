import { zodResolver } from "@hookform/resolvers/zod";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useContext } from "react";
import { useForm } from "react-hook-form";

import { SnackbarContext } from "../../../contexts/SnackbarContext";
import { RadioControl } from "../Form";
import z from "zod";

const formSchema = z.object({
  option: z.string({ required_error: "Please select an option" }).nonempty(),
});

type FormFields = z.infer<typeof formSchema>;

export const RequestOptions = ({
  options,
  onSubmit,
}: {
  options: string[];
  onSubmit: () => void;
}) => {
  const { setSnackbarOpen, setSnackbarData } = useContext(SnackbarContext);

  const submitSideEffects = (data: FormFields) => {
    console.log(data);
    setSnackbarData({ message: "Response submitted!" });
    setSnackbarOpen(true);
    onSubmit();
  };

  const { control, handleSubmit, watch } = useForm<FormFields>({
    defaultValues: {
      option: undefined,
    },
    resolver: zodResolver(formSchema),
    shouldUnregister: true,
  });

  const selectedOption = watch("option");

  return (
    <Box
      component={"form"}
      sx={(theme) => ({
        display: "flex",
        padding: "16px",
        flexDirection: "row",
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
          control={control}
          sx={{ flexDirection: "column", gap: "4px" }}
          options={options.map((option) => ({ label: option, value: option }))}
        />
      </Box>

      <Box
        sx={{
          minWidth: "120px",
          height: "100%",
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
