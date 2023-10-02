import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import FormHelperText from "@mui/material/FormHelperText";
import TextField from "@mui/material/TextField";

import { useSetupProcessWizardState } from "./setupProcessWizard";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import zod from "zod";

export const ProcessIntro = () => {
  const { setFormState } = useSetupProcessWizardState();

  const formSchema = zod.object({
    title: zod.string().nonempty(),
    description: zod.string().nonempty(),
    customIntegration: zod.string().nonempty(),
    // TODO: make the webhook URI required if customIntegration === "yes"
    webhookUri: zod.string().url().optional(),
    options: zod.string(),
  });

  type FormFields = zod.infer<typeof formSchema>;

  const { control, handleSubmit, watch } = useForm<FormFields>({
    defaultValues: {
      title: "",
      description: "",
      customIntegration: "no",
      webhookUri: "",
      options: "Yes/no emojiis",
    },
    mode: "onBlur",
    reValidateMode: "onBlur",
    resolver: zodResolver(formSchema),
    shouldUnregister: true,
  });

  const isCustomIntegration = watch("customIntegration") === "yes";

  const onSubmit = (data: FormFields) => {
    console.log("data is ", data);
    setFormState((prev) => ({
      ...prev,
      processName: data.title,
      description: data.description,
      customIntegration: data.customIntegration,
      webhookUri: data.webhookUri,
      options: data.options,
    }));
  };

  // useEffect(() => {
  //   // TypeScript users
  //   // const subscription = watch(() => handleSubmit(onSubmit)())
  //   const subscription = watch(handleSubmit(onSubmit));
  //   return () => subscription.unsubscribe();
  // }, [handleSubmit, watch]);

  return (
    <form>
      <Box sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <Controller
          name={"title"}
          control={control}
          render={({ field, fieldState: { error } }) => (
            <FormControl>
              <TextField
                {...field}
                label={"Title"}
                required
                error={Boolean(error)}
              />
              <FormHelperText
                sx={{
                  color: "error.main",
                }}
              >
                {error?.message ?? ""}
              </FormHelperText>
            </FormControl>
          )}
        />
        <Controller
          name={"description"}
          control={control}
          render={({ field, fieldState: { error } }) => (
            <FormControl>
              <TextField
                {...field}
                multiline
                minRows={2}
                label={"Description"}
                required
                error={Boolean(error)}
              />
              <FormHelperText
                sx={{
                  color: "error.main",
                }}
              >
                {error?.message ?? ""}
              </FormHelperText>
            </FormControl>
          )}
        />
        <Controller
          name={"customIntegration"}
          control={control}
          render={({ field }) => (
            <FormControl component="fieldset" required>
              <FormLabel component="legend" id="radio-buttons-group-label">
                Do you want a custom integration to execute everytime this
                process is triggered?{" "}
              </FormLabel>
              <RadioGroup
                {...field}
                row
                aria-labelledby="radio-buttons-group"
                name="row-radio-buttons-group"
              >
                <FormControlLabel value={"no"} control={<Radio />} label="No" />
                <FormControlLabel
                  value={"yes"}
                  control={<Radio />}
                  label="Yes"
                />
              </RadioGroup>
            </FormControl>
          )}
        />
        {isCustomIntegration && (
          <Controller
            name={"webhookUri"}
            control={control}
            shouldUnregister
            render={({ field, fieldState: { error } }) => {
              console.log("webook error", error);
              return (
                <FormControl>
                  <TextField
                    {...field}
                    label={"Webhook URI"}
                    required
                    error={Boolean(error)}
                  />
                  <FormHelperText
                    sx={{
                      color: error?.message ? "error.main" : "",
                    }}
                  >
                    {error?.message ?? ""}
                  </FormHelperText>
                </FormControl>
              );
            }}
          />
        )}
        <Controller
          name={"options"}
          control={control}
          render={(field) => (
            <FormControl component="fieldset" required>
              <FormLabel component="legend" id="radio-buttons-group-label">
                Do you want a custom integration to execute everytime this
                process is triggered?{" "}
              </FormLabel>
              <RadioGroup
                {...field}
                row
                aria-labelledby="radio-buttons-group"
                name="row-radio-buttons-group"
              >
                <FormControlLabel
                  value={"Yes/no emojiis"}
                  control={<Radio />}
                  label="✅ ❌"
                />
                <FormControlLabel
                  value={"Face emojiis"}
                  control={<Radio />}
                  label="😃 😐 😭"
                />
                <FormControlLabel
                  value={"Custom"}
                  control={<Radio />}
                  label="Custom"
                />
              </RadioGroup>
            </FormControl>
          )}
        />
        <Button onClick={handleSubmit(onSubmit)}>Submit</Button>
      </Box>
    </form>
  );
};
