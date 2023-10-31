import { zodResolver } from "@hookform/resolvers/zod";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import FormLabel from "@mui/material/FormLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import TextField from "@mui/material/TextField";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

import { FormOptionChoice, useNewProcessWizardState } from "./newProcessWizard";
import { RadioControl } from "../shared/Form";
import { WizardBody, WizardNav } from "../shared/Wizard";

const formSchema = z
  .object({
    name: z
      .string()
      .trim()
      .nonempty("Please add a valid title")
      .max(140, "Please keep the name under 140 characters"),
    description: z.string().trim().nonempty("Please add a valid description"),
    customIntegration: z.string().nonempty(),
    webhookUri: z.string().url("Please add a valid URL").optional(),
    options: z.string(),
    customOptions: z
      .array(
        z
          .string({ invalid_type_error: "Please only include text options" })
          .trim()
          .nonempty("Please only include text options"),
      )
      .min(1, "Add at least 1 option")
      .optional(),
  })
  .refine(
    (data) => {
      if (data.customIntegration === "yes" && data.webhookUri === "")
        return false;
      return true;
    },
    { path: ["webookUri"] },
  )
  .refine(
    (data) => {
      if (data.options === "custom" && data?.customOptions?.length === 0)
        return false;
      return true;
    },
    { path: ["customOptions"] },
  );

type FormFields = z.infer<typeof formSchema>;

export const ProcessIntro = () => {
  const { formState, setFormState, onNext, onPrev, nextLabel } =
    useNewProcessWizardState();

  const { control, handleSubmit, watch } = useForm<FormFields>({
    defaultValues: {
      name: formState.name ?? "",
      description: formState.description ?? "",
      customIntegration: formState.customIntegration ?? "no",
      webhookUri: formState.webhookUri ?? "",
      options: formState.options ?? "Yes/no emojiis",
      customOptions: formState.customOptions ?? [],
    },
    resolver: zodResolver(formSchema),
    shouldUnregister: true,
  });

  const isCustomIntegration = watch("customIntegration") === "yes";
  const isCustomOptions = watch("options") === FormOptionChoice.Custom;

  const onSubmit = (data: FormFields) => {
    setFormState((prev) => ({
      ...prev,
      name: data.name,
      description: data.description,
      customIntegration: data.customIntegration,
      webhookUri: data.webhookUri,
      options: data.options,
      customOptions: data.customOptions,
    }));
    onNext();
  };

  return (
    <>
      <WizardBody>
        <form>
          <Box sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <Controller
              name={"name"}
              control={control}
              render={({ field, fieldState: { error } }) => (
                <FormControl>
                  <TextField
                    {...field}
                    label={"Process name"}
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
                  <FormLabel
                    component="legend"
                    id="radio-buttons-group-custom-integration"
                  >
                    Do you want a custom integration to execute everytime this
                    process is triggered?{" "}
                  </FormLabel>
                  <RadioGroup
                    {...field}
                    row
                    aria-labelledby="radio-buttons-group-custom-integration"
                    name="row-radio-buttons-group-custom-integration"
                  >
                    <FormControlLabel
                      value={"no"}
                      control={<Radio />}
                      label="No"
                    />
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
            <RadioControl
              //@ts-ignore
              control={control}
              name="options"
              label="What options will users choose between?"
              options={[
                { value: FormOptionChoice.Checkmark, label: "✅ ❌" },
                { value: FormOptionChoice.Emoji, label: "😃 😐 😭" },
                { value: FormOptionChoice.Custom, label: "Custom" },
              ]}
            />

            {isCustomOptions && (
              <Controller
                name="customOptions"
                control={control}
                render={({ field, fieldState: { error } }) => {
                  return (
                    <FormControl required sx={{ width: "100%" }}>
                      <Autocomplete
                        {...field}
                        freeSolo
                        multiple
                        autoComplete={false}
                        id="tags-filled"
                        options={[]}
                        getOptionLabel={(option: string) => option}
                        onChange={(_event, data) => field.onChange(data)}
                        renderTags={(value: readonly string[], getTagProps) =>
                          value.map((option: string, index: number) => (
                            <Chip
                              variant="filled"
                              label={option}
                              color="primary"
                              {...getTagProps({ index })}
                            />
                          ))
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            placeholder="Add custom options here..."
                            error={Boolean(error)}
                          />
                        )}
                      />
                      <FormHelperText
                        sx={{
                          color: "error.main",
                        }}
                      >
                        {error?.message}
                      </FormHelperText>
                    </FormControl>
                  );
                }}
              />
            )}
          </Box>
        </form>
      </WizardBody>
      <WizardNav
        onNext={handleSubmit(onSubmit)}
        onPrev={onPrev}
        nextLabel={nextLabel}
      />
    </>
  );
};
