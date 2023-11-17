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
import { requestTemplateFormSchema } from "../formSchema";

import { webhookTriggerFilterOptions } from "../helpers/optionHelpers";
import {
  DefaultOptionSets,
  FormOptionChoice,
  HasCustomIntegration,
  defaultWebhookTriggerOption,
  useNewProcessWizardState,
} from "@/components/NewProcess/newProcessWizard";
import { RadioControl, SelectControl } from "@/components/shared/Form";
import { WizardBody, WizardNav } from "@/components/shared/Wizard";

type FormFields = z.infer<typeof requestTemplateFormSchema>;

export const Template = () => {
  const { formState, setFormState, onNext, onPrev, nextLabel } =
    useNewProcessWizardState();

  const { control, handleSubmit, watch } = useForm<FormFields>({
    defaultValues: {
      name: formState.name ?? "",
      description: formState.description ?? "",
      action: {
        optionTrigger:
          formState.action?.optionTrigger ?? defaultWebhookTriggerOption.value,
        webhook: {
          hasWebhook: formState.action?.webhook.hasWebhook ?? "no",
          uri: formState.action?.webhook.uri ?? "",
        },
      },
      options: formState.options ?? FormOptionChoice.Checkmark,
      customOptions: formState.customOptions ?? [],
    },
    resolver: zodResolver(requestTemplateFormSchema),
    shouldUnregister: true,
  });

  const options = watch("options");
  const customOptions = watch("customOptions");

  const isCustomIntegration = watch("action.webhook.hasWebhook") === "yes";
  const isCustomOptions = options === FormOptionChoice.Custom;

  const onSubmit = (data: FormFields) => {
    setFormState((prev) => ({
      ...prev,
      name: data.name,
      description: data.description,
      action: {
        optionTrigger: data.action.optionTrigger,
        webhook: {
          hasWebhook: data.action.webhook.hasWebhook,
          uri: data.action.webhook.uri,
        },
      },
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
              name={"action.webhook.hasWebhook"}
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
                      value={HasCustomIntegration.No}
                      control={<Radio />}
                      label="No"
                    />
                    <FormControlLabel
                      value={HasCustomIntegration.Yes}
                      control={<Radio />}
                      label="Yes"
                    />
                  </RadioGroup>
                </FormControl>
              )}
            />
            {isCustomIntegration && (
              <>
                <Controller
                  name={"action.webhook.uri"}
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
                <SelectControl
                  name={`action.optionTrigger`}
                  label={"When should this webhook be triggered?"}
                  selectOptions={webhookTriggerFilterOptions({
                    optionType: options,
                    customOptions: customOptions ?? [],
                  })}
                  //@ts-ignore
                  control={control}
                />
              </>
            )}
            <RadioControl
              //@ts-ignore
              control={control}
              name="options"
              label="What options will users choose between?"
              options={Array.from(DefaultOptionSets, ([value, data]) => ({
                value,
                data,
              })).map((option) => ({
                label: option.data.display,
                value: option.value,
              }))}
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
