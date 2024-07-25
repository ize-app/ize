import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Controller, FieldValues, UseControllerProps } from "react-hook-form";

import useFlowsSearch from "@/pages/Flows/useFlowsSearch";

import { EntityType, FlowSummaryFragment } from "../../../graphql/generated/graphql";
import { Avatar } from "../../AvatarOld";

interface FlowSearchProps<T extends FieldValues> extends UseControllerProps<T> {
  label?: string;
  ariaLabel: string;
  placeholderText?: string;
}

export const FlowSearch = <T extends FieldValues>({
  control,
  name,
  label,
  ariaLabel,
  ...props
}: FlowSearchProps<T>) => {
  const queryResultLimit = 20;
  const { setSearchQuery, oldCursor, setOldCursor, newCursor, flows, fetchMore, queryVars } =
    useFlowsSearch({ queryResultLimit });

  const options: FlowSummaryFragment[] = [...flows];

  return (
    <>
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => {
          return (
            <FormControl required>
              <Autocomplete
                // need to override autocomplete filtering behavior for async options
                filterOptions={(x) => x}
                includeInputInList={true}
                multiple
                aria-label={ariaLabel}
                id="tags-filled"
                size="small"
                {...field}
                {...props}
                options={options}
                getOptionLabel={(option: FlowSummaryFragment) => option.name}
                onChange={(_event, data) => {
                  return field.onChange(data);
                }}
                isOptionEqualToValue={(option: FlowSummaryFragment, value: FlowSummaryFragment) => {
                  return option.flowId === value.flowId;
                }}
                PaperComponent={({ children }) => {
                  return (
                    <Paper>
                      {children}
                      {oldCursor !== newCursor && (flows.length ?? 0) >= queryResultLimit && (
                        <Box
                          sx={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Button
                            onClick={() => {
                              setOldCursor(newCursor);
                              return fetchMore({
                                variables: {
                                  ...queryVars,
                                  cursor: newCursor,
                                },
                              });
                            }}
                          >
                            Load more
                          </Button>
                        </Box>
                      )}
                    </Paper>
                  );
                }}
                renderTags={(value: readonly FlowSummaryFragment[], getTagProps) =>
                  value.map((option: FlowSummaryFragment, index: number) => {
                    return (
                      <Chip
                        avatar={
                          <Avatar
                            id={option.flowId}
                            backgroundColor={undefined}
                            name={option.name}
                            avatarUrl={""}
                            type={EntityType.Group}
                          />
                        }
                        variant="filled"
                        label={option.name}
                        color="primary"
                        {...getTagProps({ index })}
                        key={option.flowId}
                      />
                    );
                  })
                }
                renderOption={(props, option) => (
                  <Box
                    {...props}
                    component="li"
                    sx={{
                      display: "flex",
                      width: "100%",
                      justifyContent: "left",
                      alignItems: "center",
                      gap: "16px",
                      verticalAlign: "middle",
                    }}
                    key={"option" + option.flowId}
                  >
                    <Avatar
                      id={option.flowId}
                      key={"avatar" + option.flowId}
                      name={option.name}
                      backgroundColor={undefined}
                      type={EntityType.Group}
                    />
                    <Typography
                      variant="body1"
                      sx={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {option.name}
                    </Typography>
                  </Box>
                )}
                renderInput={(params) => (
                  <TextField
                    onChange={(event) => {
                      setSearchQuery(event.target.value);
                    }}
                    {...params}
                    label={label}
                    placeholder="Add a group or identity..."
                    InputProps={{
                      ...params.InputProps,
                      type: "search",
                    }}
                    variant="outlined"
                    error={Boolean(error)}
                  />
                )}
              />
              <FormHelperText
                sx={{
                  color: "error.main",
                }}
              >
                {error?.message ?? ""}
              </FormHelperText>
            </FormControl>
          );
        }}
      />
    </>
  );
};
