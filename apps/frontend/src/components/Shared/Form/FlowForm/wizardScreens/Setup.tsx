import { zodResolver } from "@hookform/resolvers/zod";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import TextField from "@mui/material/TextField";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

import { requestTemplateFormSchema } from "../../ProcessForm/formSchema";

import { useNewProcessWizardState } from "@/components/NewProcess/newProcessWizard";
import { RoleSearchControl, SelectControl, TextFieldControl } from "@/components/shared/Form";
import { DecisionType, FormOptionChoice } from "@/components/shared/Form/ProcessForm/types";
import { WizardBody, WizardNav } from "@/components/shared/Wizard";
import { Autocomplete, Chip, InputAdornment, Paper, Typography } from "@mui/material";
import { RequestTemplateInputTable } from "../components/RequestInputTable";
import { Accordion } from "@/components/shared/Accordion";
import React from "react";

//TODO change
type FormFields = z.infer<typeof requestTemplateFormSchema>;

const ProcessStepContainer = ({ children }: { children: React.ReactNode }) => {
  return <Paper sx={{ padding: "16px 0px" }}>{children}</Paper>;
};

const ProcessStepComponentContainer = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", margin: "0px 12px" }}>
      <Typography color="primary" fontWeight={"500"} marginBottom="16px">
        {label}
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>{children}</Box>
    </Box>
  );
};

export const Setup = () => {
  const { formState, setFormState, onNext, onPrev, nextLabel } = useNewProcessWizardState();

  const { control, handleSubmit, watch } = useForm<FormFields>({
    defaultValues: {},
    resolver: zodResolver(requestTemplateFormSchema),
    shouldUnregister: true,
  });

  const onSubmit = (data: FormFields) => {
    onNext();
  };

  return (
    <>
      <WizardBody>
        <form>
          <ProcessStepContainer>
            <Box sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <Controller
                name={"name"}
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <FormControl sx={{ margin: "16px" }}>
                    <TextField
                      {...field}
                      // label={"Process name"}
                      variant="standard"
                      required
                      placeholder="Name of your process"
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
              <ProcessStepComponentContainer label="Request">
                <Box sx={{ width: "100%", display: "flex", gap: "24px" }}>
                  <SelectControl
                    //@ts-ignore
                    control={control}
                    width="400px"
                    name={"decision.requestExpirationSeconds"}
                    selectOptions={[
                      { name: "Certain people", value: "Certain people" },
                      { name: "Anyone", value: "Anyone" },
                    ]}
                    label="How is this step triggered?"
                  />
                  <RoleSearchControl
                    name="x"
                    //@ts-ignore
                    control={control}
                  />
                </Box>
                <Box sx={{ width: "100%", display: "flex", gap: "24px" }}>
                  <RequestTemplateInputTable />
                </Box>
              </ProcessStepComponentContainer>
              <ProcessStepComponentContainer label="Respond">
                <Box sx={{ width: "100%", display: "flex", gap: "24px" }}>
                  <SelectControl
                    //@ts-ignore
                    control={control}
                    width="400px"
                    name={"decision.requestExpirationSeconds"}
                    selectOptions={[
                      { name: "Certain people", value: "Certain people" },
                      { name: "Anyone", value: "Anyone" },
                    ]}
                    label="Who can respond?"
                  />
                  <RoleSearchControl
                    name="x"
                    //@ts-ignore
                    control={control}
                  />
                </Box>
                <Box sx={{ width: "100%", display: "flex", gap: "24px" }}>
                  <SelectControl
                    //@ts-ignore
                    control={control}
                    width="400px"
                    name={"decision.requestExpirationSeconds"}
                    selectOptions={[
                      { name: "A set list of options", value: "Certain people" },
                      { name: "Free text", value: "Anyone" },
                    ]}
                    label="How can they respond?"
                  />
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
                </Box>
              </ProcessStepComponentContainer>
              <ProcessStepComponentContainer label="Result">
                <Box
                  sx={{
                    display: "flex",
                    gap: "24px",
                    justifyContent: "flex-start",
                    flexWrap: "wrap",
                  }}
                >
                  <Box sx={{}}>
                    <SelectControl
                      //@ts-ignore
                      control={control}
                      name={"decision.type"}
                      sx={{ width: "300px" }}
                      selectOptions={[
                        {
                          value: DecisionType.Absolute,
                          name: "Threshold vote",
                        },
                        {
                          value: DecisionType.Percentage,
                          name: "Percentage vote",
                        },
                      ]}
                      label="When is there a final result?"
                    />
                  </Box>
                  {false ? (
                    <>
                      <Box>
                        <TextFieldControl
                          //@ts-ignore
                          control={control}
                          name={"decision.percentageDecision.percentage"}
                          label={`Option becomes final result when it has:`}
                          endAdornment={
                            <InputAdornment position="end">% of responses</InputAdornment>
                          }
                          sx={{ width: "300px" }}
                          required
                        />
                      </Box>
                      <Box>
                        <TextFieldControl
                          //@ts-ignore
                          control={control}
                          name={"decision.percentageDecision.quorum"}
                          label={`Quorum (min # of responses for a result)`}
                          endAdornment={
                            <InputAdornment position="end">total responses</InputAdornment>
                          }
                          sx={{ width: "300px" }}
                          required
                        />
                      </Box>
                    </>
                  ) : (
                    <Box>
                      <TextFieldControl
                        //@ts-ignore
                        control={control}
                        name={"decision.absoluteDecision.threshold"}
                        label={"Option is selected once it has:"}
                        sx={{ width: "300px" }}
                        endAdornment={<InputAdornment position="end">responses</InputAdornment>}
                        required
                      />
                    </Box>
                  )}
                </Box>
              </ProcessStepComponentContainer>
            </Box>
          </ProcessStepContainer>
        </form>
      </WizardBody>
      <WizardNav onNext={handleSubmit(onSubmit)} onPrev={onPrev} nextLabel={nextLabel} />
    </>
  );
};
